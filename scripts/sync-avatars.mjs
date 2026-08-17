/**
 * 소셜 로그인 프로필 이미지를 auth 메타데이터에서 public.user.avatar_url로 백필한다.
 *
 * 앞으로 로그인하는 계정은 useAuth의 syncAvatarToPublicUser가 알아서 채우지만,
 * 이미 가입해 있는 계정은 다시 로그인하기 전까지 남의 화면에서 이니셜로만 보인다.
 * 이 스크립트로 한 번 메워준다.
 *
 * - custom_avatar_url(직접 올린 이미지)은 항상 우선한다
 * - 프로바이더 avatar_url은 DB가 비어 있을 때만 채운다.
 *   덮어쓰면 custom_avatar_url 키가 생기기 전에 올린 커스텀 아바타가 소셜 기본 이미지로 밀린다
 * - 이미 같은 값이면 건너뛴다
 *   (판정 규칙은 src/lib/supabase/profileSync.ts의 syncAvatarToPublicUser와 동일)
 * - 카카오는 http로 내려주므로 https로 올린다 (https 페이지에서 혼합 콘텐츠로 차단됨)
 * - 실제로 열리는 URL인지 확인한다. 지운 지 오래된 스토리지 경로가 메타데이터에 남아 있는
 *   계정이 있어, 검사 없이 옮기면 깨진 주소만 DB에 심게 된다 (--repair로 기존 값도 정리)
 *
 * 실행: pnpm avatars:sync
 *       pnpm avatars:sync --dry-run
 */
import { loadEnv, requireEnv } from "./lib/loadEnv.mjs";

loadEnv();

const SUPABASE_URL = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
const SERVICE_KEY = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
const DRY_RUN = process.argv.includes("--dry-run");
//이미 저장된 값 중 열리지 않는 주소를 비운다
const REPAIR = process.argv.includes("--repair");

const headers = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  "Content-Type": "application/json",
};

const rest = async (path, init = {}) => {
  const res = await fetch(`${SUPABASE_URL}${path}`, { ...init, headers: { ...headers, ...init.headers } });
  const text = await res.text();
  if (!res.ok) throw new Error(`${init.method ?? "GET"} ${path} → ${res.status} ${text}`);
  return text ? JSON.parse(text) : null;
};

//카카오 프로필은 http로 내려온다 — https 페이지에서 차단되지 않도록 올려준다
const toHttps = (url) => (url ? url.replace(/^http:\/\//, "https://") : url);

//커스텀 이미지는 항상 우선, 프로바이더 이미지는 빈 칸만 채운다
const nextAvatarFor = (authUser, currentAvatar) => {
  const custom = toHttps(authUser.user_metadata?.custom_avatar_url);
  const provider = toHttps(authUser.user_metadata?.avatar_url);
  return custom ?? (currentAvatar ? null : provider) ?? null;
};

const isReachable = async (url) => {
  try {
    return (await fetch(url, { method: "HEAD" })).ok;
  } catch {
    return false;
  }
};

const main = async () => {
  const { users: authUsers } = await rest("/auth/v1/admin/users?per_page=1000");
  const profiles = await rest("/rest/v1/user?select=id,name,avatar_url&limit=1000");
  const byId = new Map(profiles.map((p) => [p.id, p]));

  const updates = [];
  const broken = [];
  const repairs = [];
  const normalized = [];
  const skipped = { 이미동일: 0, 이미지없음: 0, 프로필행없음: 0, 커스텀보호: 0 };

  for (const authUser of authUsers) {
    const profile = byId.get(authUser.id);
    if (!profile) {
      skipped.프로필행없음++;
      continue;
    }
    const avatarUrl = nextAvatarFor(authUser, profile.avatar_url);
    if (!avatarUrl) {
      //커스텀도 없고 DB에 이미 값이 있으면 건드리지 않는다 (커스텀 아바타 보호)
      if (profile.avatar_url) skipped.커스텀보호++;
      else skipped.이미지없음++;
      continue;
    }
    if (profile.avatar_url === avatarUrl) {
      skipped.이미동일++;
      continue;
    }
    if (!(await isReachable(avatarUrl))) {
      broken.push({ name: profile.name, avatarUrl, stored: false });
      continue;
    }
    const provider = (authUser.app_metadata?.providers ?? [authUser.app_metadata?.provider]).filter(Boolean).join(",");
    updates.push({ id: authUser.id, name: profile.name, provider, avatarUrl, before: profile.avatar_url });
  }

  //이미 저장된 값 손보기 — http는 https로 올리고(혼합 콘텐츠 차단 방지), 열리지 않는 주소는 비운다.
  //커스텀 아바타 보호 규칙이 메타데이터 기준이라, 저장된 값의 스킴 교정은 여기서 따로 처리한다.
  for (const profile of profiles) {
    if (!profile.avatar_url) continue;
    if (updates.some((u) => u.id === profile.id)) continue;

    const upgraded = toHttps(profile.avatar_url);
    if (upgraded !== profile.avatar_url && (await isReachable(upgraded))) {
      normalized.push({ ...profile, avatarUrl: upgraded });
      continue;
    }
    if (REPAIR && !(await isReachable(profile.avatar_url))) {
      repairs.push(profile);
      broken.push({ name: profile.name, avatarUrl: profile.avatar_url, stored: true });
    }
  }

  console.log(
    `계정 ${authUsers.length}개 · 갱신 ${updates.length}건 · https 교정 ${normalized.length}건${REPAIR ? ` · 정리 ${repairs.length}건` : ""}`
  );
  console.log(
    `건너뜀 — 이미 동일 ${skipped.이미동일} · 이미지 없음 ${skipped.이미지없음} · 커스텀 아바타 보호 ${skipped.커스텀보호} · 프로필 행 없음 ${skipped.프로필행없음}\n`
  );
  updates.forEach((u) =>
    console.log(`  ${(u.name ?? "?").padEnd(18)} ${u.provider.padEnd(14)} ${u.before ? "덮어씀" : "신규"}  ${u.avatarUrl.slice(0, 70)}`)
  );

  normalized.forEach((n) => console.log(`  ${(n.name ?? "?").padEnd(18)} ${"http→https".padEnd(14)} 교정      ${n.avatarUrl.slice(0, 70)}`));

  if (broken.length) {
    console.log(`\n열리지 않는 주소 ${broken.length}건 — ${REPAIR ? "저장된 값은 비웁니다" : "옮기지 않습니다"}`);
    broken.forEach((b) => console.log(`  ${(b.name ?? "?").padEnd(18)} ${b.stored ? "[DB 저장됨]" : "[메타데이터]"} ${b.avatarUrl.slice(0, 70)}`));
    if (!REPAIR && broken.some((b) => !b.stored)) console.log("  (이미 DB에 들어간 깨진 값을 지우려면 --repair)");
  }

  if (DRY_RUN) {
    console.log("\n[dry-run] 반영 없이 종료합니다");
    return;
  }
  for (const u of updates) {
    await rest(`/rest/v1/user?id=eq.${u.id}`, { method: "PATCH", body: JSON.stringify({ avatar_url: u.avatarUrl }) });
  }
  for (const n of normalized) {
    await rest(`/rest/v1/user?id=eq.${n.id}`, { method: "PATCH", body: JSON.stringify({ avatar_url: n.avatarUrl }) });
  }
  for (const p of repairs) {
    await rest(`/rest/v1/user?id=eq.${p.id}`, { method: "PATCH", body: JSON.stringify({ avatar_url: null }) });
  }
  console.log(
    `\n${updates.length}건 반영 · ${normalized.length}건 https 교정${repairs.length ? ` · ${repairs.length}건 정리` : ""} 완료`
  );
};

main().catch((error) => {
  console.error(`[실패] ${error.message}`);
  process.exit(1);
});
