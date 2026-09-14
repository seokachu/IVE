/**
 * 자유게시판 자동 포스팅 풀 생성기 — Claude API 로 상시성(evergreen) 글 초안을 만들어
 * community-daily-pool.mjs 끝에 이어붙인다. 사람이 쓰던 리필 루틴을 그대로 자동화한 것:
 *  1) 기존 풀·시드(community-posts.mjs) 제목을 전부 넘겨 소재가 겹치지 않게 하고
 *  2) 작성자는 풀에서 가장 적게 쓰인 이름부터 돌아가며 배정해 15명이 고르게 나오게 하고
 *  3) 받은 글은 제목 중복(유사도 포함) · 작성자/댓글 이름 · 길이 · HTML 문자 · 시사성 단어를 검사해 걸러낸 뒤
 *  4) 풀 파일과 같은 형식(p() · img(IMAGES.*))의 JS 로 직렬화해 `];` 앞에 붙인다.
 *
 * 실행: pnpm community:pool:generate --count 100            (풀에 100건 추가)
 *       pnpm community:pool:generate --count 10 --dry-run   (파일은 안 건드리고 결과 JS 만 출력)
 * 옵션: --batch 10 (호출당 글 수, 기본 10) · --model claude-opus-5
 * 필요: .env.local 의 ANTHROPIC_API_KEY — SUPABASE 키까지 있으면 user 테이블의 실제 이름으로 검증한다.
 *
 * 붙인 뒤에는 `pnpm community:daily --dry-run` 으로 "풀 N건" 이 늘었는지 확인하고, 글을 훑어본 다음 커밋한다.
 * 크론은 main 기준이라 main 에 머지돼야 반영된다.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { loadEnv, requireEnv } from "./lib/loadEnv.mjs";
import { DAILY_POOL } from "./data/community-daily-pool.mjs";
import { AUTHOR_POOL, IMAGES, POSTS } from "./data/community-posts.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
export const POOL_FILE = resolve(HERE, "data/community-daily-pool.mjs");

const DEFAULT_MODEL = "claude-opus-5";
//Opus 5 공개 단가(USD / 1M tokens) — 비용 안내용
const PRICE = { input: 5, output: 25, cacheWrite: 6.25, cacheRead: 0.5 };

//────────────────────────── 인자 ──────────────────────────
const arg = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};
const DRY_RUN = process.argv.includes("--dry-run");
const COUNT = Number(arg("--count", 30));
const BATCH = Math.max(1, Math.min(15, Number(arg("--batch", 10))));
const MODEL = arg("--model", DEFAULT_MODEL);

//────────────────────────── 고정 데이터 ──────────────────────────
//시사성 앨범 이미지(mini4)는 상시성 글에 안 어울려 뺀다
const IMAGE_KEYS = Object.keys(IMAGES).filter((k) => k !== "mini4");
const IMAGE_GUIDE = {
  members: "멤버 여섯 명 단체 사진",
  showcase: "쇼케이스 · 행사 현장",
  stage: "무대 위 공연 장면",
  stage2: "무대 위 공연 장면 (다른 컷)",
  wonyoung: "장원영 단독 사진",
  yujin: "안유진 단독 사진",
  concept: "콘셉트 포토",
  photo1: "공연 · 화보 사진",
  photo2: "공연 · 화보 사진 (다른 컷)",
  daily: "일상 · 굿즈 느낌의 사진",
};

//글에 써도 되는 곡명 — 이 밖의 곡 · 앨범 · 수치 · 발언 인용은 금지(사실 오류 방지)
const SAFE_SONGS =
  "ELEVEN · LOVE DIVE · After LIKE · Kitsch · I AM · Baddie · Either Way · Off The Record · HEYA · Accendio · " +
  "Rebel Heart · ATTITUDE · Royal · Take It · Mine · Hypnosis · Lips · Cherish · Shine With Me · Holy Moly · Blue Blood · Payback · Heroine";

const CATEGORIES = [
  "음악 · 무대 · 수록곡 · 안무 (곡 감상, 파트, 플레이리스트, 라이브)",
  "멤버 개별 매력 (안유진 · 가을 · 레이 · 장원영 · 리즈 · 이서 중 한 명, 한 배치 안에서 멤버가 겹치지 않게)",
  "굿즈샵 · 굿즈 관리 · 진열 · 포카 · 앨범 (구매 후기, 보관, 정리, 선물)",
  "콘서트 · 음악방송 · 팬미팅 · 행사 준비 (좌석, 준비물, 응원, 후기)",
  "덕질 일상 · 습관 · 덕메 · 예산 · 직장/학교 생활 속 덕질",
  "게시판 · 사이트 이용 (소식 탭 · 굿즈샵 리뷰 · 마이페이지 · 다크모드 · 앨범 미리듣기 · 멤버십) 또는 가벼운 놀이글(투표 · 삼행시 · 하나만 고르기)",
];

//시사성 단어 — 제목 · 본문에 있으면 상시성 글이 아니라고 보고 버린다
const TIMELY = /20\d\d년|D-\d+|티저|사전녹화|이번 주|이번 컴백|컴백 준비|올해|내년|작년|지난주|시즌 그리팅|연말|새해|크리스마스|할로윈|수능|방금|어제/;

//────────────────────────── 스키마 ──────────────────────────
const CommentSchema = z.object({
  by: z.string(),
  text: z.string(),
  replies: z.array(z.object({ by: z.string(), text: z.string() })),
});
const PostSchema = z.object({
  title: z.string(),
  author: z.string(),
  views: z.number().int(),
  likes: z.number().int(),
  lines: z.array(z.string()),
  image: z.enum([...IMAGE_KEYS, "none"]),
  comments: z.array(CommentSchema),
});
const BatchSchema = z.object({ posts: z.array(PostSchema) });

//────────────────────────── 유틸 ──────────────────────────
const normalize = (s) => s.toLowerCase().replace(/[\s\p{P}\p{S}]/gu, "");
const bigrams = (s) => {
  const n = normalize(s);
  const set = new Set();
  for (let i = 0; i < n.length - 1; i++) set.add(n.slice(i, i + 2));
  return set;
};
//제목 유사도(문자 2-gram 자카드) — 0.5 이상이면 같은 소재로 본다
const similarity = (a, b) => {
  const A = bigrams(a);
  const B = bigrams(b);
  if (A.size === 0 || B.size === 0) return 0;
  let inter = 0;
  for (const g of A) if (B.has(g)) inter++;
  return inter / (A.size + B.size - inter);
};

const clamp = (n, min, max) => Math.min(max, Math.max(min, Math.round(n)));

//풀의 HTML 본문을 예시용 줄 배열로 되돌린다 (p() 가 만든 <p>…</p> 를 분해)
const htmlToLines = (html) =>
  html
    .replace(/<p><img[^>]*><\/p>/g, "")
    .split("</p>")
    .filter(Boolean)
    .map((seg) => seg.replace(/^<p>/, "").replace(/^<br>$/, ""));

//────────────────────────── 검증 ──────────────────────────
/**
 * 받은 글 하나를 검사해 문제가 있으면 이유 문자열, 없으면 null.
 * 숫자(views · likes)는 버리지 않고 범위로 잘라 넣는다.
 */
export const validatePost = (post, { author, names, existingTitles }) => {
  const title = post.title.trim();
  if (title.length < 8 || title.length > 40) return `제목 길이 ${title.length}`;
  if (/[<>\n"]/.test(title)) return "제목에 금지 문자";
  if (TIMELY.test(title)) return "제목에 시사성 단어";
  for (const t of existingTitles) {
    if (normalize(t) === normalize(title)) return `제목 중복: ${t}`;
    if (similarity(t, title) >= 0.5) return `제목 유사: ${t}`;
  }

  const lines = post.lines.map((l) => l.trim());
  if (lines.length < 3 || lines.length > 12) return `본문 ${lines.length}줄`;
  if (lines.filter(Boolean).length < 2) return "본문이 비었음";
  if (lines.some((l) => l.length > 220)) return "본문 한 줄이 너무 김";
  if (lines.some((l) => /[<>]/.test(l))) return "본문에 HTML 문자";
  if (lines.some((l) => TIMELY.test(l))) return "본문에 시사성 단어";
  if (lines[0] === "") return "첫 줄이 빈 줄";

  if (post.comments.length < 2 || post.comments.length > 5) return `댓글 ${post.comments.length}개`;
  for (const c of post.comments) {
    if (!names.has(c.by)) return `모르는 댓글 작성자: ${c.by}`;
    if (c.by === author) return "작성자 본인의 최상위 댓글";
    if (c.text.trim().length < 2 || c.text.length > 90) return "댓글 길이";
    if (/[<>]/.test(c.text)) return "댓글에 HTML 문자";
    if (c.replies.length > 2) return "대댓글 3개 이상";
    for (const r of c.replies) {
      if (!names.has(r.by)) return `모르는 대댓글 작성자: ${r.by}`;
      if (r.text.trim().length < 2 || r.text.length > 90) return "대댓글 길이";
      if (/[<>]/.test(r.text)) return "대댓글에 HTML 문자";
    }
  }
  return null;
};

//검증을 통과한 글을 풀 항목 모양으로 정리(작성자는 배정값으로 고정, 숫자는 범위로)
export const normalizePost = (post, author) => ({
  title: post.title.trim(),
  author,
  views: clamp(post.views, 100, 220),
  likes: clamp(post.likes, 3, 12),
  lines: post.lines.map((l) => l.trim()),
  image: post.image === "none" ? null : post.image,
  comments: post.comments.map((c) => ({
    by: c.by,
    text: c.text.trim(),
    replies: c.replies.map((r) => ({ by: r.by, text: r.text.trim() })),
  })),
});

//────────────────────────── 직렬화 ──────────────────────────
const js = (s) => JSON.stringify(s);

const serializeComment = (c) => {
  if (c.replies.length === 0) return `      { by: ${js(c.by)}, text: ${js(c.text)} },`;
  const replies = c.replies.map((r) => `{ by: ${js(r.by)}, text: ${js(r.text)} }`).join(", ");
  return ["      {", `        by: ${js(c.by)},`, `        text: ${js(c.text)},`, `        replies: [${replies}],`, "      },"].join("\n");
};

/** 풀 파일의 손글 항목과 같은 모양의 JS 소스 한 항목 */
export const serializePost = (post) => {
  const out = ["  {", `    title: ${js(post.title)},`, `    author: ${js(post.author)},`, `    views: ${post.views},`, `    likes: ${post.likes},`];
  if (post.image) {
    //풀의 관례: 첫 줄 + 빈 줄 → 이미지 → 나머지
    const rest = post.lines.slice(1);
    while (rest[0] === "") rest.shift();
    out.push("    content:", `      p(${js(post.lines[0])}, "") +`, `      img(IMAGES.${post.image}) +`, "      p(");
    out.push(rest.map((l) => `        ${js(l)}`).join(",\n"));
    out.push("      ),");
  } else {
    out.push("    content: p(");
    out.push(post.lines.map((l) => `      ${js(l)}`).join(",\n"));
    out.push("    ),");
  }
  out.push("    comments: [", ...post.comments.map(serializeComment), "    ],", "  },");
  return out.join("\n");
};

export const appendToPool = (source, posts) => {
  const trimmed = source.trimEnd();
  if (!trimmed.endsWith("];")) throw new Error("풀 파일이 `];` 로 끝나지 않습니다");
  const body = posts.map(serializePost).join("\n");
  return `${trimmed.slice(0, -2)}${body}\n];\n`;
};

//────────────────────────── 프롬프트 ──────────────────────────
const buildSystem = (names) => {
  const examples = DAILY_POOL.slice(0, 3).map((p) => ({
    title: p.title,
    author: p.author,
    views: p.views,
    likes: p.likes,
    lines: htmlToLines(p.content),
    image: "none",
    comments: p.comments.map((c) => ({ by: c.by, text: c.text, replies: (c.replies ?? []).map((r) => ({ by: r.by, text: r.text })) })),
  }));

  return [
    "너는 IVE(아이브) 팬 커뮤니티 'IVE로 DIVE' 자유게시판에 매일 자동으로 올라갈 글을 쓰는 작가다. 실제 팬 여러 명이 쓴 것처럼 자연스러운 한국어 게시글과 댓글을 만든다.",
    "",
    "## 절대 규칙",
    "- 상시성(evergreen) 글만: 특정 날짜 · 컴백 · 티저 · 시즌 · 연도 · 최근 사건에 묶인 내용 금지. 언제 올라가도 어색하지 않아야 한다.",
    `- 곡명은 다음 목록 안에서만 쓴다: ${SAFE_SONGS}. 이 밖의 곡 · 앨범명 · 수치 · 날짜 · 발언 인용 · 구체적 사실 주장은 쓰지 않는다.`,
    "- 멤버는 안유진(유진, 리더) · 가을 · 레이 · 장원영(원영) · 리즈 · 이서(막내) 여섯 명, 팬덤명은 DIVE(다이브). 멤버 비교 · 서열 · 외모 평가 · 사생활 · 루머 · 논란 · 타 그룹 언급 금지.",
    "- 작성자(author)는 지정된 이름을 그대로 쓴다. 댓글(by)은 아래 이름 목록에서만 고르고, 최상위 댓글에는 작성자 본인을 쓰지 않는다. 대댓글(replies)은 댓글당 0~2개이며 보통 작성자가 답하는 형태다.",
    `- 이름 목록: ${[...names].join(" · ")}`,
    "- 본문 lines 는 문단 단위 문자열 배열이며 빈 줄은 \"\" 로 넣는다. 3~9줄, 첫 줄은 비우지 않는다. 목록은 \"- \" 또는 \"1. \" 로 시작하는 줄로 쓴다. HTML 태그 · 링크 · 해시태그 금지.",
    "- 문체: 커뮤니티 존댓말(~요 / ~습니다), 'ㅋㅋ' 적당히, 이모지는 제목에 최대 1개. 광고 · 홍보 · 과장 없이 진짜 팬이 쓴 것처럼 구체적인 경험과 소소한 디테일을 담는다.",
    "- 제목은 12~32자, 질문형 · 경험담형 · 정보형 · 투표형을 섞고, 제공되는 기존 제목과 소재 · 표현이 겹치지 않게 한다. 같은 배치 안에서도 소재가 겹치면 안 된다.",
    "- 댓글은 2~5개, 각 5~60자. 본문에 실제로 반응(질문에 답하기 · 경험담 · 공감 · 가벼운 농담)하고, 서로 다른 관점이 섞이게 한다.",
    "- views 는 110~210, likes 는 4~11. 질문 · 투표 · 공감형 글은 높게, 잔잔한 후기는 낮게.",
    `- image 는 10건 중 1건 정도만, 본문과 맞을 때만 키를 고르고 나머지는 \"none\": ${IMAGE_KEYS.map((k) => `${k}(${IMAGE_GUIDE[k]})`).join(", ")}. 이미지는 첫 문단 뒤에 들어간다.`,
    "- 사이트 기능(소식 탭, 굿즈샵 리뷰 · 위시리스트 · 장바구니, 마이페이지, 다크모드, 앨범 미리듣기, DIVE 멤버십)은 자연스럽게 언급해도 된다.",
    "",
    "## 기존 글 예시 (형식 · 문체 참고)",
    JSON.stringify(examples, null, 2),
  ].join("\n");
};

const buildUser = (assignments, existingTitles) =>
  [
    `이번 배치에서 ${assignments.length}건을 만든다. 각 글의 작성자와 소재 분류는 아래로 고정한다.`,
    ...assignments.map((a, i) => `${i + 1}. author="${a.author}" · 분류: ${a.category}`),
    "",
    "## 이미 있는 제목 (같은 소재 · 비슷한 표현의 글은 만들지 않는다)",
    ...existingTitles.map((t) => `- ${t}`),
  ].join("\n");

//────────────────────────── 메인 ──────────────────────────
const fetchDbNames = async () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  try {
    const res = await fetch(`${url}/rest/v1/user?select=name`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
    if (!res.ok) return null;
    const rows = await res.json();
    return new Set(rows.map((u) => u.name).filter(Boolean));
  } catch {
    return null;
  }
};

const main = async () => {
  loadEnv();
  requireEnv("ANTHROPIC_API_KEY");
  if (!Number.isInteger(COUNT) || COUNT < 1) {
    console.error("[오류] --count 는 1 이상의 정수여야 합니다");
    process.exit(1);
  }

  //검증용 이름: DB 이름이 있으면 AUTHOR_POOL 과 교집합(닉네임이 바뀐 계정은 자동 제외)
  const dbNames = await fetchDbNames();
  const authors = dbNames ? AUTHOR_POOL.filter((n) => dbNames.has(n)) : [...AUTHOR_POOL];
  if (dbNames && authors.length < AUTHOR_POOL.length) {
    console.warn(`[경고] user 테이블에 없는 작성자 제외: ${AUTHOR_POOL.filter((n) => !dbNames.has(n)).join(", ")}`);
  }
  const names = new Set(authors);
  console.log(`${dbNames ? "DB 이름으로 검증" : "AUTHOR_POOL 로 검증(SUPABASE 키 없음)"} · 작성자 ${authors.length}명 · 모델 ${MODEL}`);

  //작성자 배정: 풀에서 적게 쓰인 이름부터
  const usage = new Map(authors.map((n) => [n, 0]));
  for (const p of DAILY_POOL) if (usage.has(p.author)) usage.set(p.author, usage.get(p.author) + 1);
  const nextAuthors = (n) => {
    const picked = [];
    for (let i = 0; i < n; i++) {
      const [name] = [...usage.entries()].sort((a, b) => a[1] - b[1] || authors.indexOf(a[0]) - authors.indexOf(b[0]))[0];
      usage.set(name, usage.get(name) + 1);
      picked.push(name);
    }
    return picked;
  };

  const existingTitles = [...DAILY_POOL.map((p) => p.title), ...POSTS.map((p) => p.title)];
  const accepted = [];
  const rejected = [];
  const totals = { input: 0, output: 0, cacheWrite: 0, cacheRead: 0 };
  const client = new Anthropic();
  const system = buildSystem(names);

  let categoryOffset = 0;
  const maxRounds = Math.ceil(COUNT / BATCH) * 2 + 2;
  for (let round = 1; accepted.length < COUNT && round <= maxRounds; round++) {
    const n = Math.min(BATCH, COUNT - accepted.length);
    const assignments = nextAuthors(n).map((author, i) => ({ author, category: CATEGORIES[(categoryOffset + i) % CATEGORIES.length] }));
    categoryOffset = (categoryOffset + n) % CATEGORIES.length;

    process.stdout.write(`[${round}/${maxRounds}] ${n}건 요청 중… `);
    let response;
    try {
      response = await client.messages.parse({
        model: MODEL,
        max_tokens: 16000,
        system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
        messages: [{ role: "user", content: buildUser(assignments, existingTitles) }],
        output_config: { format: zodOutputFormat(BatchSchema) },
      });
    } catch (error) {
      if (error instanceof Anthropic.RateLimitError) {
        console.log("속도 제한 — 20초 뒤 재시도");
        await new Promise((r) => setTimeout(r, 20000));
        continue;
      }
      throw error;
    }

    const u = response.usage;
    totals.input += u.input_tokens;
    totals.output += u.output_tokens;
    totals.cacheWrite += u.cache_creation_input_tokens ?? 0;
    totals.cacheRead += u.cache_read_input_tokens ?? 0;

    if (response.stop_reason === "refusal") {
      console.log(`거절됨(${response.stop_details?.category ?? "?"}) — 다음 배치로`);
      continue;
    }
    if (!response.parsed_output) {
      console.log(`파싱 실패(stop_reason=${response.stop_reason}) — 다음 배치로`);
      continue;
    }

    let ok = 0;
    response.parsed_output.posts.forEach((post, i) => {
      //모델이 순서를 지켰다고 가정하되, 배정된 이름이 아니면 배정값으로 덮는다
      const author = assignments[i]?.author ?? assignments[assignments.length - 1].author;
      if (accepted.length >= COUNT) return;
      const reason = validatePost(post, { author, names, existingTitles });
      if (reason) {
        rejected.push({ title: post.title, reason });
        return;
      }
      const clean = normalizePost(post, author);
      accepted.push(clean);
      existingTitles.push(clean.title);
      ok++;
    });
    console.log(`${ok}건 통과 (누적 ${accepted.length}/${COUNT})`);
  }

  if (rejected.length) {
    console.log(`\n걸러진 글 ${rejected.length}건:`);
    for (const r of rejected) console.log(`  - "${r.title}" → ${r.reason}`);
  }

  const cost =
    (totals.input * PRICE.input + totals.output * PRICE.output + totals.cacheWrite * PRICE.cacheWrite + totals.cacheRead * PRICE.cacheRead) / 1e6;
  console.log(
    `\n토큰 입력 ${totals.input.toLocaleString()} · 출력 ${totals.output.toLocaleString()} · 캐시 쓰기 ${totals.cacheWrite.toLocaleString()} · 캐시 읽기 ${totals.cacheRead.toLocaleString()} → 약 $${cost.toFixed(2)}`,
  );

  if (accepted.length === 0) {
    console.error("[오류] 통과한 글이 없습니다");
    process.exit(1);
  }

  if (DRY_RUN) {
    console.log(`\n[dry-run] 통과한 ${accepted.length}건 — 파일은 수정하지 않음\n`);
    console.log(accepted.map(serializePost).join("\n"));
    return;
  }

  const source = readFileSync(POOL_FILE, "utf8");
  writeFileSync(POOL_FILE, appendToPool(source, accepted));
  const byAuthor = {};
  for (const p of accepted) byAuthor[p.author] = (byAuthor[p.author] ?? 0) + 1;
  console.log(`\n${accepted.length}건을 풀에 추가 → 총 ${DAILY_POOL.length + accepted.length}건 (작성자: ${JSON.stringify(byAuthor)})`);
  console.log("다음: pnpm community:daily --dry-run 으로 '풀 N건' 확인 후, 글을 훑어보고 커밋하세요.");
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Anthropic.APIError ? `[API 오류 ${error.status}] ${error.message}` : error);
    process.exit(1);
  });
}
