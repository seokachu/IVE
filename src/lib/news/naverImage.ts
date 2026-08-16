//네이버 이미지 검색으로 대표 사진 찾기 — API Hub 앱에서 '이미지 검색' 미활성화면 자동 스킵
const NAVER_IMAGE_API_URL = "https://naverapihub.apigw.ntruss.com/search/v1/image";
const IMAGE_REVALIDATE_SECONDS = 86400;

export const findNaverImage = async (query: string): Promise<string | null> => {
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  try {
    const params = new URLSearchParams({ query: query.slice(0, 100), display: "1", sort: "sim", filter: "large" });
    const res = await fetch(`${NAVER_IMAGE_API_URL}?${params}`, {
      headers: { "X-NCP-APIGW-API-KEY-ID": clientId, "X-NCP-APIGW-API-KEY": clientSecret },
      next: { revalidate: IMAGE_REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;

    const data: { items?: { thumbnail?: string }[] } = await res.json();
    const thumbnail = data.items?.[0]?.thumbnail || null;
    //pstatic 썸네일은 type 파라미터로 크기 조절 가능 — 기본 150px를 400px로 업그레이드
    return thumbnail ? thumbnail.replace("type=b150", "type=b400") : null;
  } catch {
    return null;
  }
};
