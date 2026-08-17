/**
 * 최신 앨범 라인업을 굿즈샵에 반영한다 — 신규 SKU 추가 + 기존 앨범 제목·갤러리 보정.
 *
 * - 제목이 같은 상품이 이미 있으면 새로 만들지 않고 갱신한다 (여러 번 돌려도 안전)
 * - 이미지는 버킷에 실제로 존재하는지 확인한 뒤에만 넣는다
 * - 갱신 전 goods 전체를 scripts/backup/ 에 저장한다
 *
 * 실행: pnpm goods:albums
 *       pnpm goods:albums --dry-run
 */
import { randomUUID } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadEnv, requireEnv } from "./lib/loadEnv.mjs";
import { NEW_ALBUMS, ALBUM_PATCHES } from "./data/goods-albums.mjs";

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
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { ...init, headers: { ...headers, ...init.headers } });
  const text = await res.text();
  if (!res.ok) throw new Error(`${init.method ?? "GET"} ${path} → ${res.status} ${text}`);
  return text ? JSON.parse(text) : null;
};

const imageExists = async (url) => {
  try {
    return (await fetch(url, { method: "HEAD" })).ok;
  } catch {
    return false;
  }
};

const main = async () => {
  const goods = await rest("goods?select=*&limit=300");
  const byId = new Map(goods.map((g) => [g.id, g]));
  const byTitle = new Map(goods.map((g) => [g.title.trim(), g]));

  //── 이미지 사전 검증 — 깨진 URL이 상품에 박히면 목록에서 회색 타일로 남는다
  const allImages = [
    ...NEW_ALBUMS.flatMap((a) => [a.thumbnail, ...a.images]),
    ...ALBUM_PATCHES.flatMap((p) => p.images ?? []),
  ];
  const broken = [];
  for (const url of [...new Set(allImages)]) {
    if (!(await imageExists(url))) broken.push(url);
  }
  if (broken.length) {
    console.error(`[중단] 버킷에 없는 이미지 ${broken.length}건:`);
    broken.forEach((u) => console.error(`  ${u.split("/goods/")[1]}`));
    process.exit(1);
  }
  console.log(`이미지 확인 완료 — ${new Set(allImages).size}장 모두 존재`);

  //── 기존 상품 보정
  console.log("\n=== 기존 앨범 보정 ===");
  const patches = [];
  for (const patch of ALBUM_PATCHES) {
    const current = byId.get(patch.id);
    if (!current) {
      console.warn(`  [건너뜀] DB에 없는 상품 ${patch.id}`);
      continue;
    }
    const { id, ...fields } = patch;
    const changed = Object.keys(fields).filter((key) => JSON.stringify(current[key]) !== JSON.stringify(fields[key]));
    if (changed.length === 0) {
      console.log(`  [변경 없음] ${current.title.trim()}`);
      continue;
    }
    console.log(`  ${current.title.trim()} → ${changed.join(", ")} 갱신${fields.title ? ` (제목: ${fields.title})` : ""}`);
    patches.push({ id, fields });
  }

  //── 신규 SKU
  console.log("\n=== 신규 앨범 SKU ===");
  const inserts = [];
  const updates = [];
  for (const album of NEW_ALBUMS) {
    const existing = byTitle.get(album.title);
    if (existing) {
      console.log(`  [이미 있음 → 갱신] ${album.title}`);
      updates.push({ id: existing.id, fields: album });
      continue;
    }
    console.log(`  [추가] ${album.title} — ${album.price.toLocaleString()}원 · ${album.shipping_type} · ${album.created_at.slice(0, 10)}`);
    inserts.push({ id: randomUUID(), review_count: 0, ...album });
  }

  if (DRY_RUN) {
    console.log(`\n[dry-run] 신규 ${inserts.length} · 갱신 ${patches.length + updates.length}건 예정`);
    return;
  }

  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "");
  const backupDir = resolve(process.cwd(), "scripts/backup");
  mkdirSync(backupDir, { recursive: true });
  const backupPath = resolve(backupDir, `goods-albums-${stamp}.json`);
  writeFileSync(backupPath, JSON.stringify({ savedAt: new Date().toISOString(), goods }, null, 2));
  console.log(`\n백업 — ${backupPath}`);

  for (const { id, fields } of [...patches, ...updates]) {
    await rest(`goods?id=eq.${id}`, { method: "PATCH", body: JSON.stringify(fields) });
  }
  if (inserts.length) {
    await rest("goods", { method: "POST", body: JSON.stringify(inserts) });
  }

  //goods.review_count는 앱이 런타임에 다시 계산해 쓰는 값이라 DB 값이 방치돼 음수까지 남아 있었다
  await rest("goods?review_count=neq.0", { method: "PATCH", body: JSON.stringify({ review_count: 0 }) });

  console.log(`\n신규 ${inserts.length}건 등록 · 기존 ${patches.length + updates.length}건 갱신 완료`);
  console.log("새 SKU id (goods-catalog.mjs에 추가하세요):");
  inserts.forEach((row) => console.log(`  ["${row.id}", "${row.created_at.slice(0, 10)}", ${row.discount_rate}, "${row.shipping_type === "무료배송" ? "F" : "N"}", "std", "${row.title}"],`));
};

main().catch((error) => {
  console.error(`[실패] ${error.message}`);
  process.exit(1);
});
