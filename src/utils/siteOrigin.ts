//SSR 시점에 사이트 origin("https://host")을 구한다 — 유튜브 임베드 origin 파라미터처럼 브라우저의
//window.location.origin과 같아야 하는 값에 쓴다. Vercel은 시스템 env로 도메인을 알려주고,
//로컬은 NEXT_PUBLIC_DEFAULT_URL을 쓴다. 못 구하면 null — 호출 쪽에서 클라이언트 보정을 맡긴다.
export const getSiteOrigin = (): string | null => {
  const { VERCEL_ENV, VERCEL_PROJECT_PRODUCTION_URL, VERCEL_URL, NEXT_PUBLIC_DEFAULT_URL } = process.env;

  if (VERCEL_ENV === "production" && VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (VERCEL_URL) return `https://${VERCEL_URL}`;

  const local = NEXT_PUBLIC_DEFAULT_URL?.trim().replace(/\/+$/, "");
  return local || null;
};
