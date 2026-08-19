/**
 * 자유게시판 매일 자동 포스팅 — community-daily-pool.mjs 의 글을 하루 2~3건씩 올린다.
 *
 * GitHub Actions 크론(하루 4회)마다 실행되어:
 *  1) 오늘(KST) 올라간 풀 글이 목표치(날짜 기반 2~3건)보다 적으면 새 글 1건 등록
 *  2) 최근 올라간 풀 글에 예정 시각이 지난 댓글·대댓글을 그때그때 나눠 등록
 *  3) 좋아요·조회수를 시간 경과에 따라 목표치까지 서서히 올린다
 * → 글 하나가 등록 직후엔 조용하다가 몇 시간에 걸쳐 반응이 쌓이는 것처럼 보인다.
 *
 * 실행: pnpm community:daily            (실제 반영)
 *       pnpm community:daily --dry-run  (변경 없이 계획만 출력)
 *
 * 풀이 소진되면 exit 1 로 실패해 Actions 알림 메일이 오므로,
 * 그때 community-daily-pool.mjs 에 글을 이어붙이면 된다.
 */
import { loadEnv, requireEnv } from "./lib/loadEnv.mjs";
import { AUTHOR_POOL } from "./data/community-posts.mjs";
import { DAILY_POOL } from "./data/community-daily-pool.mjs";

loadEnv();

const SUPABASE_URL = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
const SERVICE_KEY = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
const DRY_RUN = process.argv.includes("--dry-run");

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

//────────────────────────── 시각·해시 유틸 ──────────────────────────
const NOW = new Date();
const KST = 9 * 60 * 60 * 1000;
const kstDateKey = (date) => new Date(date.getTime() + KST).toISOString().slice(0, 10);
const TODAY = kstDateKey(NOW);

//결정적 해시 — 같은 입력이면 항상 같은 값이 나와 실행 시점이 달라도 계획이 흔들리지 않는다
const hash = (str) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
};

const minutes = (n) => n * 60 * 1000;
const hoursSince = (iso) => (NOW.getTime() - new Date(iso).getTime()) / (60 * 60 * 1000);
const firstImage = (html) => html.match(/<img[^>]+src="([^">]+)"/)?.[1] ?? null;

//댓글 예정 시각 — 글 등록 후 35분~몇 시간에 걸쳐 순서대로 쌓인다
const commentDueAt = (post, base, ci) => new Date(base.getTime() + minutes((ci + 1) * (35 + (hash(post.title + ci) % 55))));
const replyDueAt = (post, parentDue, ri) => new Date(parentDue.getTime() + minutes((ri + 1) * (25 + (hash(post.title + "r" + ri) % 45))));

//────────────────────────── 메인 ──────────────────────────
const main = async () => {
  const users = await select("user?select=id,name");
  const byName = new Map();
  for (const u of users) if (u.name && !byName.has(u.name)) byName.set(u.name, u.id);

  const boards = await select("board?select=id,title,views,user_id,created_at");
  const boardByTitle = new Map(boards.map((b) => [b.title, b]));

  const posted = DAILY_POOL.filter((p) => boardByTitle.has(p.title));
  const remaining = DAILY_POOL.filter((p) => !boardByTitle.has(p.title));
  const postedToday = posted.filter((p) => kstDateKey(new Date(boardByTitle.get(p.title).created_at)) === TODAY);
  const targetToday = 2 + (hash(TODAY) % 2); //날짜별로 2건 또는 3건

  console.log(`풀 ${DAILY_POOL.length}건 중 게시 ${posted.length} · 남음 ${remaining.length} — 오늘 ${postedToday.length}/${targetToday}건`);

  //1. 오늘 목표치가 남았으면 새 글 1건
  if (postedToday.length < targetToday && remaining.length) {
    const post = remaining[0];
    const authorId = byName.get(post.author);
    if (!authorId) throw new Error(`user 테이블에 없는 닉네임: ${post.author}`);
    const createdAt = new Date(NOW.getTime() - minutes(3 + (hash(post.title) % 35)));
    if (DRY_RUN) {
      console.log(`[dry-run] 새 글 등록 예정 — "${post.title}" (${post.author})`);
    } else {
      const [row] = await insert("board", [
        {
          user_id: authorId,
          title: post.title,
          content: post.content,
          thumbnail: firstImage(post.content),
          views: Math.max(3, Math.round(post.views * 0.05)),
          created_at: createdAt.toISOString(),
        },
      ]);
      boardByTitle.set(post.title, row);
      posted.push(post);
      console.log(`새 글 등록 — "${post.title}" (id ${row.id})`);
    }
  } else if (!remaining.length) {
    console.log("오늘 새로 올릴 글 없음 (풀 소진)");
  } else {
    console.log("오늘 목표치 도달 — 새 글 없이 반응만 갱신");
  }

  //2. 최근 3일 내 풀 글에 댓글·좋아요·조회수 드립
  const recent = posted.filter((p) => hoursSince(boardByTitle.get(p.title).created_at) <= 72);
  if (recent.length) {
    const ids = recent.map((p) => boardByTitle.get(p.title).id);
    const [existingComments, existingLikes] = await Promise.all([
      select(`board_comments?select=id,board_id,content,parent_id&board_id=in.(${ids.join(",")})`),
      select(`board_likes?select=board_id,user_id&board_id=in.(${ids.join(",")})`),
    ]);
    const hasComment = (boardId, text) => existingComments.some((c) => c.board_id === boardId && c.content === text);
    const findComment = (boardId, text) => existingComments.find((c) => c.board_id === boardId && c.content === text);
    const likePool = AUTHOR_POOL.map((name) => byName.get(name)).filter(Boolean);

    for (const post of recent) {
      const board = boardByTitle.get(post.title);
      const base = new Date(board.created_at);

      //댓글 — 예정 시각이 지났고 아직 없는 것만 등록
      for (const [ci, c] of (post.comments ?? []).entries()) {
        const due = commentDueAt(post, base, ci);
        if (due <= NOW && !hasComment(board.id, c.text)) {
          if (DRY_RUN) console.log(`[dry-run] 댓글 등록 예정 — "${post.title}" ← ${c.by}`);
          else {
            const [row] = await insert("board_comments", [
              { board_id: board.id, user_id: byName.get(c.by), content: c.text, parent_id: null, created_at: due.toISOString() },
            ]);
            existingComments.push(row);
            console.log(`댓글 등록 — "${post.title}" ← ${c.by}`);
          }
        }
        //대댓글 — 부모 댓글이 DB에 있어야 달 수 있다
        const parent = findComment(board.id, c.text);
        for (const [ri, r] of (c.replies ?? []).entries()) {
          const rDue = replyDueAt(post, due, ri);
          if (parent && rDue <= NOW && !hasComment(board.id, r.text)) {
            if (DRY_RUN) console.log(`[dry-run] 대댓글 등록 예정 — "${post.title}" ← ${r.by}`);
            else {
              const [row] = await insert("board_comments", [
                { board_id: board.id, user_id: byName.get(r.by), content: r.text, parent_id: parent.id, created_at: rDue.toISOString() },
              ]);
              existingComments.push(row);
              console.log(`대댓글 등록 — "${post.title}" ← ${r.by}`);
            }
          }
        }
      }

      //좋아요 — 30시간에 걸쳐 목표치까지 증가
      const elapsed = hoursSince(board.created_at);
      const likeGoal = Math.min(post.likes, Math.round(post.likes * Math.min(1, elapsed / 30)) + (elapsed > 1 ? 1 : 0));
      const liked = new Set(existingLikes.filter((l) => l.board_id === board.id).map((l) => l.user_id));
      const candidates = likePool.filter((id) => id !== board.user_id && !liked.has(id));
      const toAdd = Math.max(0, Math.min(likeGoal - liked.size, candidates.length));
      if (toAdd > 0) {
        const rows = Array.from({ length: toAdd }, (_, n) => ({
          board_id: board.id,
          user_id: candidates[(n + hash(post.title)) % candidates.length],
          created_at: NOW.toISOString(),
        }));
        const unique = [...new Map(rows.map((r) => [r.user_id, r])).values()];
        if (DRY_RUN) console.log(`[dry-run] 좋아요 +${unique.length} — "${post.title}"`);
        else {
          await insert("board_likes", unique);
          console.log(`좋아요 +${unique.length} — "${post.title}" (${liked.size + unique.length}/${post.likes})`);
        }
      }

      //조회수 — 72시간에 걸쳐 목표치까지 증가 (감소는 없음)
      const viewGoal = Math.round(post.views * Math.min(1, elapsed / 72));
      if (viewGoal > board.views) {
        if (DRY_RUN) console.log(`[dry-run] 조회수 ${board.views} → ${viewGoal} — "${post.title}"`);
        else {
          await patch(`board?id=eq.${board.id}`, { views: viewGoal });
          console.log(`조회수 ${board.views} → ${viewGoal} — "${post.title}"`);
        }
      }
    }
  }

  //3. 풀 상태 알림 — 소진되면 실패 처리해 Actions 메일로 리필 시점을 알린다
  if (!remaining.length) {
    console.error("[알림] 글 풀이 소진되었습니다. scripts/data/community-daily-pool.mjs에 글을 추가해주세요.");
    process.exit(1);
  }
  if (remaining.length <= 5) console.warn(`[주의] 남은 글이 ${remaining.length}건입니다. 곧 풀 리필이 필요해요.`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
