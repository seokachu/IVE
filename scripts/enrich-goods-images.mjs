/**
 * 크롤링 상품의 상세 갤러리 이미지를 채우는 스크립트.
 *
 * 공식몰 상품 상세의 세로 상세컷(ec-data-src)을 받아 위에서부터 정사각 타일로 잘라
 * 내용이 있는 타일만 WebP로 업로드하고, goods.images를 해당 추가 이미지로 갱신한다.
 * (갤러리는 [thumbnail, ...images]로 합성되므로 images에는 썸네일을 넣지 않는다)
 *
 * 실행: pnpm goods:enrich             (images가 비었거나 썸네일뿐인 크롤링 상품만)
 *       pnpm goods:enrich --force     (크롤링 상품 전체 다시 생성)
 */
import sharp from "sharp";
import { loadEnv, requireEnv } from "./lib/loadEnv.mjs";

loadEnv();

const SUPABASE_URL = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
const SERVICE_KEY = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
const BUCKET = "goods";
const SHOP_ORIGIN = "https://starship-square.com";
const REQUEST_DELAY_MS = 800;
const TILE_OUTPUT_WIDTH = 800;
const WEBP_QUALITY = 80;
const MAX_EXTRA_IMAGES = 2;
//거의 단색(여백) 타일 제외 기준 — 채널 표준편차 평균
const MIN_TILE_STDDEV = 12;
//안내문·혜택·푸터성 상세컷 제외
const EXCLUDED_NAME = /notice|benefit|bottom|footer|caution|delivery|g_starship/i;
const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36";
const FORCE = process.argv.includes("--force");

const headers = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const absolutize = (url) => {
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("/")) return `${SHOP_ORIGIN}${url}`;
  return url;
};

//상세 페이지에서 세로 상세컷 URL 목록 추출
const fetchDetailCuts = async (productNo) => {
  const res = await fetch(`${SHOP_ORIGIN}/product/detail.html?product_no=${productNo}`, {
    headers: { "User-Agent": USER_AGENT },
  });
  if (!res.ok) throw new Error(`상세 페이지 요청 실패 (${res.status}): product_no=${productNo}`);
  const html = await res.text();

  const urls = [...html.matchAll(/ec-data-src="([^"]+)"/g)].map((m) => absolutize(m[1]));
  return [...new Set(urls)].filter((url) => !EXCLUDED_NAME.test(url));
};

//세로 상세컷을 위에서부터 정사각 타일로 잘라 내용이 있는 타일만 반환
//(failOn:"none" — 끝이 잘린 원본 JPEG도 디코딩 가능한 부분까지 사용)
const extractTiles = async (buffer, needed) => {
  const open = () => sharp(buffer, { failOn: "none" });
  const { width, height } = await open().metadata();
  if (!width || !height) return [];

  const tiles = [];
  const tileCount = Math.floor(height / width);
  for (let i = 0; i < tileCount && tiles.length < needed; i += 1) {
    const tile = open().extract({ left: 0, top: i * width, width, height: width });
    const stats = await tile.clone().stats();
    const avgStddev = stats.channels.reduce((sum, c) => sum + c.stdev, 0) / stats.channels.length;
    if (avgStddev < MIN_TILE_STDDEV) continue; //여백뿐인 타일 제외

    tiles.push(
      await tile
        .resize({ width: TILE_OUTPUT_WIDTH, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toBuffer(),
    );
  }
  return tiles;
};

const uploadWebp = async (path, buffer) => {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "image/webp", "x-upsert": "true" },
    body: buffer,
  });
  if (!res.ok) throw new Error(`업로드 실패 (${res.status}): ${path}`);
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
};

const enrichOne = async (row) => {
  const productNo = row.thumbnail.split("/crawled/")[1].split(".webp")[0];
  const cuts = await fetchDetailCuts(productNo);

  const extras = [];
  for (const cutUrl of cuts) {
    if (extras.length >= MAX_EXTRA_IMAGES) break;
    const res = await fetch(cutUrl, { headers: { "User-Agent": USER_AGENT, Referer: SHOP_ORIGIN } });
    if (!res.ok) continue;
    const tiles = await extractTiles(Buffer.from(await res.arrayBuffer()), MAX_EXTRA_IMAGES - extras.length);
    for (const tile of tiles) {
      extras.push(await uploadWebp(`crawled/${productNo}-${extras.length + 1}.webp`, tile));
    }
    await sleep(REQUEST_DELAY_MS);
  }

  const patch = await fetch(`${SUPABASE_URL}/rest/v1/goods?id=eq.${row.id}`, {
    method: "PATCH",
    headers: { ...headers, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify({ images: extras }),
  });
  if (!patch.ok) throw new Error(`goods 업데이트 실패 (${patch.status}): ${row.id}`);
  return extras.length;
};

const main = async () => {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/goods?select=id,title,thumbnail,images&thumbnail=like.*%2Fcrawled%2F*`,
    { headers },
  );
  if (!res.ok) throw new Error(`goods 조회 실패 (${res.status})`);
  const rows = await res.json();

  //기본: 아직 추가 이미지가 없는(비었거나 썸네일만 든) 상품만 처리
  const targets = FORCE
    ? rows
    : rows.filter((row) => {
        const images = Array.isArray(row.images) ? row.images : [];
        return images.filter((url) => url !== row.thumbnail).length === 0;
      });
  console.log(`크롤링 상품 ${rows.length}개 중 처리 대상 ${targets.length}개${FORCE ? " (--force)" : ""}`);

  let enriched = 0;
  for (const [index, row] of targets.entries()) {
    try {
      const added = await enrichOne(row);
      enriched += added > 0 ? 1 : 0;
      console.log(`[${index + 1}/${targets.length}] ${row.title.slice(0, 40)} — 추가 ${added}장`);
      await sleep(REQUEST_DELAY_MS);
    } catch (error) {
      console.error(`[실패] ${row.title}:`, error.message);
    }
  }
  console.log(`\n완료 — 추가 이미지가 생긴 상품 ${enriched}/${targets.length}개`);
};

main().catch((error) => {
  console.error("[중단]", error);
  process.exit(1);
});
