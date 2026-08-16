/**
 * crawl-goods.mjs 초기 실행에서 잘못 등록된 상품을 정리하는 일회성 스크립트.
 * - CRAVITY(다른 아티스트) 상품 — 공식몰 검색 결과에 섞여 들어온 항목
 * - 기존 수기 등록 앨범과 표기만 다른 중복 앨범 3종
 * 삭제 대상 행과 함께 crawled/ 폴더의 해당 썸네일도 제거한다.
 *
 * 실행: node scripts/cleanup-crawled-goods.mjs
 */
import { loadEnv, requireEnv } from "./lib/loadEnv.mjs";

loadEnv();

const SUPABASE_URL = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
const SERVICE_KEY = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

const DUPLICATE_TITLES = new Set([
  "IVE THE 1ST ALBUM I’ve IVE",
  "IVE 3RD SINGLE ALBUM AFTER LIKE",
  "IVE THE 2ND SINGLE ALBUM LOVE DIVE",
]);

const headers = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  "Content-Type": "application/json",
};

const main = async () => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/goods?select=id,title,thumbnail`, { headers });
  if (!res.ok) throw new Error(`goods 조회 실패 (${res.status})`);
  const rows = await res.json();

  const targets = rows.filter((row) => row.title.startsWith("CRAVITY") || DUPLICATE_TITLES.has(row.title));
  console.log(`삭제 대상 ${targets.length}개`);

  const storagePaths = [];
  for (const row of targets) {
    const del = await fetch(`${SUPABASE_URL}/rest/v1/goods?id=eq.${row.id}`, { method: "DELETE", headers });
    if (!del.ok) throw new Error(`삭제 실패 (${del.status}): ${row.title}`);
    if (row.thumbnail?.includes("/goods/crawled/")) {
      storagePaths.push(`crawled/${row.thumbnail.split("/crawled/")[1]}`);
    }
    console.log(`- ${row.title}`);
  }

  if (storagePaths.length > 0) {
    const del = await fetch(`${SUPABASE_URL}/storage/v1/object/goods`, {
      method: "DELETE",
      headers,
      body: JSON.stringify({ prefixes: storagePaths }),
    });
    if (!del.ok) throw new Error(`스토리지 삭제 실패 (${del.status})`);
    console.log(`스토리지 썸네일 ${storagePaths.length}개 삭제`);
  }

  const left = await fetch(`${SUPABASE_URL}/rest/v1/goods?select=id`, { headers });
  console.log(`남은 상품 수: ${(await left.json()).length}개`);
};

main().catch((error) => {
  console.error("[중단]", error);
  process.exit(1);
});
