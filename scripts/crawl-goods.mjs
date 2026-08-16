/**
 * 스타쉽스퀘어 공식몰(starship-square.com)에서 IVE 굿즈를 수집해
 * 이미지를 WebP로 변환·업로드한 뒤 goods 테이블에 자동 등록하는 스크립트.
 *
 * - 검색 결과(서버렌더링 HTML)를 파싱하며, 품절 상품은 제외
 * - 제목 정규화 기준으로 기존 상품과 중복이면 건너뜀
 * - 요청 간 1초 간격으로 예의 있게 수집
 *
 * 실행: pnpm goods:crawl              (실제 등록)
 *       pnpm goods:crawl --dry-run   (등록 없이 수집 결과만 출력)
 */
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { loadEnv, requireEnv } from "./lib/loadEnv.mjs";

loadEnv();

const SUPABASE_URL = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
const SERVICE_KEY = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
const BUCKET = "goods";
const SHOP_ORIGIN = "https://starship-square.com";
const SEARCH_KEYWORD = "IVE";
const MAX_PAGES = 10;
const REQUEST_DELAY_MS = 1000;
const MAX_WIDTH = 800;
const WEBP_QUALITY = 80;
const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36";
const DRY_RUN = process.argv.includes("--dry-run");

const headers = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const decodeEntities = (text) =>
  text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");

//중복 판정용 제목 정규화 (album-sync와 동일한 방식)
const normalizeTitle = (title) =>
  title
    .replace(/[^\p{L}\p{N}]/gu, "")
    .toLowerCase();

//검색 결과에 같은 소속사 다른 아티스트 상품이 섞여 나와 IVE 관련 상품만 통과
const isIveProduct = (title) => /\bIVE\b|MINIVE|미니브/i.test(title);

//기존 수기 등록 상품과 제목 표기만 다른 동일 상품 (재실행 시 재등록 방지)
const EXCLUDED_TITLES = new Set([
  "IVE THE 1ST ALBUM I’ve IVE",
  "IVE 3RD SINGLE ALBUM AFTER LIKE",
  "IVE THE 2ND SINGLE ALBUM LOVE DIVE",
].map(normalizeTitle));

//검색 결과 한 페이지에서 상품 블록 파싱
const parseProducts = (html) => {
  const products = [];
  const blocks = html.split(/<li id="anchorBoxId_(\d+)"/).slice(1);

  for (let i = 0; i < blocks.length; i += 2) {
    const productNo = blocks[i];
    const block = blocks[i + 1] ?? "";

    const nameMatch = block.match(/class="name"><a [^>]*>\s*<span[^>]*>([\s\S]*?)<\/span>/);
    const priceMatch = block.match(/([\d,]{2,})원/);
    const imageMatch = block.match(/src="(\/\/[^"]+\/web\/product\/[^"]+)"/);
    //품절 상품: soldout 요소에 displaynone이 빠진 상태로 노출됨
    const soldOut = /class="(?![^"]*displaynone)[^"]*soldout/.test(block);

    if (!nameMatch || !priceMatch || !imageMatch || soldOut) continue;

    products.push({
      productNo,
      title: decodeEntities(nameMatch[1].replace(/<[^>]+>/g, "").trim()),
      price: Number(priceMatch[1].replace(/,/g, "")),
      imageUrl: `https:${imageMatch[1]}`,
    });
  }
  return products;
};

//검색 전체 페이지 순회 수집
const crawlSearchResults = async () => {
  const seen = new Set();
  const products = [];

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const url = `${SHOP_ORIGIN}/product/search.html?keyword=${encodeURIComponent(SEARCH_KEYWORD)}&page=${page}`;
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    if (!res.ok) throw new Error(`검색 페이지 요청 실패 (${res.status}): page=${page}`);

    const pageProducts = parseProducts(await res.text());
    const fresh = pageProducts.filter((p) => !seen.has(p.productNo));
    if (fresh.length === 0) break; //마지막 페이지 이후엔 첫 페이지가 반복 노출됨

    fresh.forEach((p) => seen.add(p.productNo));
    products.push(...fresh);
    console.log(`page ${page}: ${fresh.length}개 수집 (누적 ${products.length}개)`);
    await sleep(REQUEST_DELAY_MS);
  }
  return products;
};

//상품 이미지를 WebP로 변환해 스토리지에 업로드하고 공개 URL 반환
const uploadThumbnail = async (product) => {
  //big(고해상도) 우선, 없으면 medium으로 폴백
  const candidates = [product.imageUrl.replace("/medium/", "/big/"), product.imageUrl];
  let original = null;
  for (const url of candidates) {
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT, Referer: SHOP_ORIGIN } });
    if (res.ok) {
      original = Buffer.from(await res.arrayBuffer());
      break;
    }
  }
  if (!original) throw new Error(`이미지 다운로드 실패: ${product.imageUrl}`);

  const webp = await sharp(original)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();

  const path = `crawled/${product.productNo}.webp`;
  const upload = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "image/webp", "x-upsert": "true" },
    body: webp,
  });
  if (!upload.ok) throw new Error(`업로드 실패 (${upload.status}): ${path}`);

  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
};

//"(BANGERS ver.) IVE THE 2ND ALBUM REVIVE+" 같은 버전 변형은 대표 상품 1개로 축약
const collapseVariants = (products) => {
  const groups = new Map();
  for (const product of products) {
    const baseTitle = product.title.replace(/^\([^)]*\)\s*/, "").trim();
    const key = normalizeTitle(baseTitle);
    if (!groups.has(key)) {
      groups.set(key, { ...product, title: baseTitle });
    }
  }
  return [...groups.values()];
};

const fetchExistingTitles = async () => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/goods?select=title`, { headers });
  if (!res.ok) throw new Error(`기존 상품 조회 실패 (${res.status})`);
  const rows = await res.json();
  return new Set(rows.map((row) => normalizeTitle(row.title)));
};

const insertGoods = async (row) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/goods`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(row),
  });
  if (!res.ok) throw new Error(`등록 실패 (${res.status}): ${row.title} — ${await res.text()}`);
};

const main = async () => {
  console.log(`스타쉽스퀘어에서 "${SEARCH_KEYWORD}" 상품 수집 시작${DRY_RUN ? " (dry-run)" : ""}`);
  const [products, existingTitles] = await Promise.all([crawlSearchResults(), fetchExistingTitles()]);

  const collapsed = collapseVariants(products.filter((p) => isIveProduct(p.title)));
  const fresh = collapsed.filter(
    (p) => !existingTitles.has(normalizeTitle(p.title)) && !EXCLUDED_TITLES.has(normalizeTitle(p.title)),
  );
  console.log(
    `수집 ${products.length}개 → 버전 축약 후 ${collapsed.length}개, 신규 ${fresh.length}개 (기존 중복 ${collapsed.length - fresh.length}개 제외)`,
  );

  if (DRY_RUN) {
    fresh.forEach((p) => console.log(`- ${p.title} | ${p.price.toLocaleString()}원`));
    return;
  }

  let inserted = 0;
  for (const [index, product] of fresh.entries()) {
    try {
      const thumbnail = await uploadThumbnail(product);
      await insertGoods({
        id: randomUUID(),
        title: product.title,
        price: product.price,
        discount_rate: 0,
        thumbnail,
        images: [thumbnail],
        size: "ONE SIZE",
        color: "free",
        shipping_type: product.price >= 30000 ? "무료배송" : "일반배송",
        delivery_info: "일반배송",
        description: ["스타쉽스퀘어 공식 굿즈입니다."],
        created_at: new Date().toISOString(),
        review_count: 0,
      });
      inserted += 1;
      console.log(`[${index + 1}/${fresh.length}] 등록: ${product.title}`);
      await sleep(REQUEST_DELAY_MS);
    } catch (error) {
      console.error(`[실패] ${product.title}:`, error.message);
    }
  }
  console.log(`\n완료 — 신규 등록 ${inserted}개`);
};

main().catch((error) => {
  console.error("[중단]", error);
  process.exit(1);
});
