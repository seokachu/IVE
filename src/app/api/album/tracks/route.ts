import { NextRequest, NextResponse } from "next/server";
import { getAlbumTracks } from "@/lib/album/itunes";

export async function GET(request: NextRequest) {
  const title = request.nextUrl.searchParams.get("title");
  if (!title) {
    return NextResponse.json({ error: "앨범 제목이 필요합니다." }, { status: 400 });
  }

  try {
    const tracks = await getAlbumTracks(title);
    //결과가 있을 때만 일주일 CDN 캐시 — 빈 결과(iTunes 스토어프론트 장애 등)가 일주일 눌러앉지 않게 5분만
    const cacheControl =
      tracks.length > 0 ? "public, max-age=0, s-maxage=604800, stale-while-revalidate=86400" : "public, max-age=0, s-maxage=300";
    return NextResponse.json(tracks, { headers: { "Cache-Control": cacheControl } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "수록곡을 가져오는데 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
