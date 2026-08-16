/**
 * goods 스토리지 버킷의 PNG/JPG 이미지를 WebP로 변환해 재업로드하고,
 * goods 테이블의 thumbnail/images URL을 새 WebP 경로로 교체하는 일회성 스크립트.
 *
 * 실행: pnpm goods:optimize        (원본 파일은 유지)
 *       pnpm goods:optimize --purge (변환 완료 후 원본 삭제)
 */
import sharp from "sharp";
import { loadEnv, requireEnv } from "./lib/loadEnv.mjs";

loadEnv();

const SUPABASE_URL = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
const SERVICE_KEY = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
const BUCKET = "goods";
const MAX_WIDTH = 1000;
const WEBP_QUALITY = 80;
const PURGE = process.argv.includes("--purge");

const headers = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
};

const publicUrl = (path) => `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;

//버킷 전체 파일 목록 (폴더 재귀 탐색)
const listAll = async (prefix = "") => {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/list/${BUCKET}`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ prefix, limit: 1000, offset: 0, sortBy: { column: "name", order: "asc" } }),
  });
  if (!res.ok) throw new Error(`목록 조회 실패 (${res.status}): ${prefix}`);
  const entries = await res.json();

  const files = [];
  for (const entry of entries) {
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.id === null) {
      files.push(...(await listAll(path))); //폴더
    } else {
      files.push({ path, size: entry.metadata?.size ?? 0, mimetype: entry.metadata?.mimetype ?? "" });
    }
  }
  return files;
};

const isConvertTarget = ({ path, mimetype }) => {
  if (path.endsWith(".webp") || path.endsWith(".avif")) return false;
  if (/\.(png|jpe?g)$/i.test(path)) return true;
  //확장자 없는 파일은 mimetype으로 판단
  return /image\/(png|jpeg)/.test(mimetype);
};

const toWebpPath = (path) => path.replace(/\.(png|jpe?g)$/i, "") + ".webp";

const convertOne = async (file) => {
  const res = await fetch(publicUrl(file.path), { headers });
  if (!res.ok) throw new Error(`다운로드 실패 (${res.status}): ${file.path}`);
  const original = Buffer.from(await res.arrayBuffer());

  const webp = await sharp(original)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();

  const newPath = toWebpPath(file.path);
  const upload = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${newPath}`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "image/webp", "x-upsert": "true" },
    body: webp,
  });
  if (!upload.ok) throw new Error(`업로드 실패 (${upload.status}): ${newPath}`);

  return { oldPath: file.path, newPath, before: original.length, after: webp.length };
};

//goods 테이블의 thumbnail/images URL을 변환된 WebP URL로 교체
const updateGoodsRows = async (urlMap) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/goods?select=id,thumbnail,images`, { headers });
  if (!res.ok) throw new Error(`goods 조회 실패 (${res.status})`);
  const rows = await res.json();

  //DB에는 공백이 %20으로 인코딩된 URL도 있어 디코딩 기준으로 매칭
  const replaceUrl = (url) => {
    if (typeof url !== "string") return url;
    return urlMap.get(url) ?? urlMap.get(decodeURIComponent(url)) ?? url;
  };

  let updated = 0;
  for (const row of rows) {
    const nextThumbnail = replaceUrl(row.thumbnail);
    const nextImages = Array.isArray(row.images) ? row.images.map(replaceUrl) : row.images;
    const changed =
      nextThumbnail !== row.thumbnail || JSON.stringify(nextImages) !== JSON.stringify(row.images);
    if (!changed) continue;

    const patch = await fetch(`${SUPABASE_URL}/rest/v1/goods?id=eq.${row.id}`, {
      method: "PATCH",
      headers: { ...headers, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ thumbnail: nextThumbnail, images: nextImages }),
    });
    if (!patch.ok) throw new Error(`goods 업데이트 실패 (${patch.status}): ${row.id}`);
    updated += 1;
  }
  return updated;
};

const removeOriginals = async (paths) => {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}`, {
    method: "DELETE",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ prefixes: paths }),
  });
  if (!res.ok) throw new Error(`원본 삭제 실패 (${res.status})`);
};

const main = async () => {
  console.log("goods 버킷 파일 목록 조회 중...");
  const files = await listAll();
  const targets = files.filter(isConvertTarget);
  console.log(`전체 ${files.length}개 중 변환 대상 ${targets.length}개`);

  const urlMap = new Map();
  const converted = [];
  for (const [index, file] of targets.entries()) {
    try {
      const result = await convertOne(file);
      urlMap.set(publicUrl(result.oldPath), publicUrl(result.newPath));
      converted.push(result);
      console.log(
        `[${index + 1}/${targets.length}] ${result.oldPath} → ${result.newPath} ` +
          `(${Math.round(result.before / 1024)}KB → ${Math.round(result.after / 1024)}KB)`,
      );
    } catch (error) {
      console.error(`[실패] ${file.path}:`, error.message);
    }
  }

  const updated = await updateGoodsRows(urlMap);
  const before = converted.reduce((sum, r) => sum + r.before, 0);
  const after = converted.reduce((sum, r) => sum + r.after, 0);
  console.log(`\n변환 ${converted.length}개 · DB 행 업데이트 ${updated}개`);
  console.log(`용량: ${Math.round(before / 1024)}KB → ${Math.round(after / 1024)}KB (${Math.round((1 - after / before) * 100)}% 절감)`);

  if (PURGE && converted.length > 0) {
    await removeOriginals(converted.map((r) => r.oldPath));
    console.log(`원본 ${converted.length}개 삭제 완료`);
  } else if (converted.length > 0) {
    console.log("원본은 유지했습니다. 삭제하려면 --purge 옵션으로 다시 실행하세요.");
  }
};

main().catch((error) => {
  console.error("[중단]", error);
  process.exit(1);
});
