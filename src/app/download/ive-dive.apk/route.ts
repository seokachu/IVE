export const dynamic = "force-dynamic";
//70MB 스트리밍 여유 (하비 플랜 상한 내)
export const maxDuration = 60;

//APK 동일 출처 프록시 — GitHub 릴리스 저장소(release-assets.githubusercontent.com)가
//일부 모바일 회선·공유기에서 막히거나 끊겨 다운로드가 "다운로드 중"에서 멈추는 문제 우회.
//서비스 도메인은 폰에서 이미 잘 열리므로, Vercel이 GitHub에서 받아 그대로 흘려보낸다.
const APK_URL = "https://github.com/seokachu/ive-app/releases/latest/download/ive-dive.apk";

export async function GET() {
  const upstream = await fetch(APK_URL, { redirect: "follow", cache: "no-store" });
  if (!upstream.ok || !upstream.body) {
    return Response.json({ error: "APK를 가져오지 못했습니다. 잠시 후 다시 시도해 주세요." }, { status: 502 });
  }

  const headers = new Headers({
    "Content-Type": "application/vnd.android.package-archive",
    "Content-Disposition": 'attachment; filename="ive-dive.apk"',
    "Cache-Control": "no-store",
  });
  const contentLength = upstream.headers.get("content-length");
  if (contentLength) headers.set("Content-Length", contentLength);

  return new Response(upstream.body, { headers });
}
