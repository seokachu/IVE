/**
 * 자유게시판을 실제 팬 커뮤니티 톤의 콘텐츠로 재구성하고,
 * 굿즈샵 후기의 무의미한 문구를 상품별 실사용 후기로 교체하는 스크립트.
 *
 * - board / board_comments / board_likes 를 전부 비우고 scripts/data/community-posts.mjs 로 다시 채운다
 * - goods_reviews 는 행을 지우지 않고 content·rating·name 만 갱신한다 (주문·상품 연결 유지)
 * - 삭제 전 현재 데이터를 scripts/backup/ 에 JSON 으로 저장한다
 *
 * 실행: pnpm community:seed              (실제 반영)
 *       pnpm community:seed --dry-run    (변경 없이 계획만 출력)
 *       pnpm community:seed --board-only (게시판만, 후기는 건드리지 않음)
 *       pnpm community:seed --append     (기존 데이터를 지우지 않고, DB에 없는 제목의 글만 추가)
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadEnv, requireEnv } from "./lib/loadEnv.mjs";
import { POSTS, AUTHOR_POOL } from "./data/community-posts.mjs";
import { REVIEW_REWRITES, KEEP_IDS } from "./data/community-reviews.mjs";

loadEnv();

const SUPABASE_URL = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
const SERVICE_KEY = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
const DRY_RUN = process.argv.includes("--dry-run");
const BOARD_ONLY = process.argv.includes("--board-only");
const APPEND = process.argv.includes("--append");

const headers = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  "Content-Type": "application/json",
};

const rest = async (path, init = {}) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: { ...headers, ...init.headers },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${init.method ?? "GET"} ${path} → ${res.status} ${text}`);
  return text ? JSON.parse(text) : null;
};

const select = (path) => rest(path);
const insert = (table, rows) =>
  rest(table, { method: "POST", body: JSON.stringify(rows), headers: { Prefer: "return=representation" } });
const patch = (path, body) => rest(path, { method: "PATCH", body: JSON.stringify(body) });
const remove = (path) => rest(path, { method: "DELETE" });

//────────────────────────── 시각 계산 ──────────────────────────
//day(며칠 전) + 인덱스로 결정적인 시각을 만든다 — 실행할 때마다 결과가 흔들리지 않도록
const NOW = new Date();
const postDate = (day, index) => {
  const d = new Date(NOW);
  d.setDate(d.getDate() - day);
  //오늘 글은 몇 시간 전, 과거 글은 09~23시 사이에 흩뿌린다
  if (day === 0) d.setHours(NOW.getHours() - ((index % 6) + 1), (index * 17) % 60, 0, 0);
  else d.setHours(9 + ((index * 5) % 14), (index * 23) % 60, 0, 0);
  return d;
};
//댓글은 글 작성 이후 ~ 지금 사이에 순서대로 쌓인다
const commentDate = (base, order) => {
  const d = new Date(base.getTime() + (order + 1) * (37 + order * 11) * 60 * 1000);
  return d > NOW ? new Date(NOW.getTime() - (10 - order) * 60 * 1000) : d;
};

const firstImage = (html) => html.match(/<img[^>]+src="([^">]+)"/)?.[1] ?? null;

//────────────────────────── 메인 ──────────────────────────
const main = async () => {
  //1. 유저 조회 — 이름 → id 매핑
  const users = await select("user?select=id,name");
  const byName = new Map();
  for (const u of users) if (u.name && !byName.has(u.name)) byName.set(u.name, u.id);

  const missing = [...new Set([...AUTHOR_POOL, ...POSTS.flatMap((p) => [p.author, ...(p.comments ?? []).flatMap((c) => [c.by, ...(c.replies ?? []).map((r) => r.by)])])])].filter(
    (name) => !byName.has(name)
  );
  if (missing.length) {
    console.error(`[오류] user 테이블에 없는 닉네임: ${missing.join(", ")}`);
    process.exit(1);
  }

  const likePool = AUTHOR_POOL.map((name) => byName.get(name));

  //2·3. 백업 + 게시판 비우기 — append 모드에서는 아무것도 지우지 않고 DB에 없는 제목의 글만 골라낸다
  let seedPosts = POSTS;
  let oldReviews = [];
  if (APPEND) {
    const existing = await select("board?select=title");
    const titles = new Set(existing.map((b) => b.title));
    seedPosts = POSTS.filter((p) => !titles.has(p.title));
    console.log(`append 모드 — 기존 게시글 ${existing.length}건 유지 · 새 글 ${seedPosts.length}건 추가 대상`);
    if (!seedPosts.length) {
      console.log("추가할 새 글이 없습니다.");
      return;
    }
  } else {
    const [oldBoards, oldComments, oldLikes, reviews] = await Promise.all([
      select("board?select=*&order=id.asc"),
      select("board_comments?select=*&order=id.asc"),
      select("board_likes?select=*&order=id.asc"),
      select("goods_reviews?select=*&order=created_at.asc"),
    ]);
    oldReviews = reviews;

    const stamp = NOW.toISOString().slice(0, 19).replace(/[:T]/g, "");
    const backupDir = resolve(process.cwd(), "scripts/backup");
    const backupPath = resolve(backupDir, `community-${stamp}.json`);
    if (!DRY_RUN) {
      mkdirSync(backupDir, { recursive: true });
      writeFileSync(
        backupPath,
        JSON.stringify({ savedAt: NOW.toISOString(), board: oldBoards, board_comments: oldComments, board_likes: oldLikes, goods_reviews: oldReviews }, null, 2)
      );
    }

    console.log(`현재 상태 — 게시글 ${oldBoards.length} · 댓글 ${oldComments.length} · 좋아요 ${oldLikes.length} · 굿즈후기 ${oldReviews.length}`);
    console.log(`백업 — ${DRY_RUN ? "(dry-run, 저장 안 함)" : backupPath}`);

    if (!DRY_RUN) {
      await remove("board_likes?id=gt.0");
      await remove("board_comments?id=gt.0");
      await remove("board?id=gt.0");
      console.log("기존 게시판 데이터 삭제 완료");
    } else {
      console.log("[dry-run] 게시판 데이터 삭제 예정");
    }
  }

  //4. 새 게시글 — 오래된 글부터 넣어 id 순서와 시간 순서를 맞춘다
  const ordered = [...seedPosts].sort((a, b) => b.day - a.day);
  const rows = ordered.map((post, i) => ({
    user_id: byName.get(post.author),
    title: post.title,
    content: post.content,
    thumbnail: firstImage(post.content),
    views: post.views,
    created_at: postDate(post.day, i).toISOString(),
  }));

  if (DRY_RUN) {
    console.log(`[dry-run] 게시글 ${rows.length}건 등록 예정`);
    ordered.forEach((p, i) => console.log(`  ${String(i + 1).padStart(2)}. ${p.title} — ${p.author} · ${p.day}일 전 · 댓글 ${(p.comments ?? []).reduce((n, c) => n + 1 + (c.replies?.length ?? 0), 0)} · 좋아요 ${p.likes}`));
  } else {
    //Supabase REST는 한 번에 넣어도 순서를 보장하므로 배치로 처리
    const inserted = [];
    for (let i = 0; i < rows.length; i += 20) {
      inserted.push(...(await insert("board", rows.slice(i, i + 20))));
    }
    inserted.sort((a, b) => a.id - b.id);
    console.log(`게시글 ${inserted.length}건 등록 완료 (id ${inserted[0].id}~${inserted.at(-1).id})`);

    //5. 댓글 — 최상위 먼저 넣고 반환된 id로 대댓글 연결
    const topRows = [];
    const topMeta = [];
    ordered.forEach((post, i) => {
      const boardId = inserted[i].id;
      const base = new Date(rows[i].created_at);
      (post.comments ?? []).forEach((c, ci) => {
        topRows.push({
          board_id: boardId,
          user_id: byName.get(c.by),
          content: c.text,
          parent_id: null,
          created_at: commentDate(base, ci).toISOString(),
        });
        topMeta.push({ boardId, base, replies: c.replies ?? [], order: ci });
      });
    });

    const topInserted = [];
    for (let i = 0; i < topRows.length; i += 50) {
      topInserted.push(...(await insert("board_comments", topRows.slice(i, i + 50))));
    }
    topInserted.sort((a, b) => a.id - b.id);

    const replyRows = [];
    topMeta.forEach((meta, i) => {
      meta.replies.forEach((r, ri) => {
        replyRows.push({
          board_id: meta.boardId,
          user_id: byName.get(r.by),
          content: r.text,
          parent_id: topInserted[i].id,
          created_at: commentDate(meta.base, meta.order + ri + 1).toISOString(),
        });
      });
    });
    if (replyRows.length) await insert("board_comments", replyRows);
    console.log(`댓글 ${topInserted.length}건 · 대댓글 ${replyRows.length}건 등록 완료`);

    //6. 좋아요 — 작성자를 제외한 유저 풀에서 글마다 다른 조합으로 배정
    const likeRows = [];
    ordered.forEach((post, i) => {
      const boardId = inserted[i].id;
      const authorId = byName.get(post.author);
      const candidates = likePool.filter((id) => id !== authorId);
      for (let n = 0; n < Math.min(post.likes, candidates.length); n++) {
        likeRows.push({
          board_id: boardId,
          user_id: candidates[(n + i * 3) % candidates.length],
          created_at: commentDate(new Date(rows[i].created_at), n).toISOString(),
        });
      }
    });
    //(board_id, user_id) 중복 제거
    const seen = new Set();
    const uniqueLikes = likeRows.filter((l) => {
      const key = `${l.board_id}:${l.user_id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    for (let i = 0; i < uniqueLikes.length; i += 100) {
      await insert("board_likes", uniqueLikes.slice(i, i + 100));
    }
    console.log(`좋아요 ${uniqueLikes.length}건 등록 완료`);
  }

  //7. 굿즈샵 후기 리라이트
  if (BOARD_ONLY || APPEND) {
    console.log(`${APPEND ? "--append" : "--board-only"} 지정 — 굿즈 후기는 건너뜁니다`);
    return;
  }

  const byId = new Map(oldReviews.map((r) => [r.id, r]));
  const nameById = new Map(users.map((u) => [u.id, u.name]));
  const unknown = REVIEW_REWRITES.filter((r) => !byId.has(r.id));
  if (unknown.length) console.warn(`[경고] DB에 없는 후기 ${unknown.length}건은 건너뜁니다`);

  const targets = REVIEW_REWRITES.filter((r) => byId.has(r.id) && !KEEP_IDS.includes(r.id));
  //닉네임이 바뀐 후기도 현재 닉네임으로 맞춘다
  const untouched = oldReviews.filter((r) => !targets.some((t) => t.id === r.id));

  if (DRY_RUN) {
    console.log(`[dry-run] 굿즈 후기 ${targets.length}건 교체 예정 · 유지 ${untouched.length}건`);
    targets.slice(0, 5).forEach((t) => console.log(`  · ${byId.get(t.id).content.slice(0, 20)}… → ${t.content.slice(0, 40)}…`));
    return;
  }

  for (const t of targets) {
    const current = byId.get(t.id);
    await patch(`goods_reviews?id=eq.${t.id}`, {
      content: t.content,
      rating: t.rating,
      name: nameById.get(current.user_id) ?? current.name,
    });
  }
  //손대지 않는 후기도 닉네임만 현재 값으로 동기화
  for (const r of untouched) {
    const currentName = nameById.get(r.user_id);
    if (currentName && currentName !== r.name) {
      await patch(`goods_reviews?id=eq.${r.id}`, { name: currentName });
    }
  }
  console.log(`굿즈 후기 ${targets.length}건 교체 완료 (유지 ${untouched.length}건)`);
};

main().catch((error) => {
  console.error(`[실패] ${error.message}`);
  process.exit(1);
});
