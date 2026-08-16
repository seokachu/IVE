import { NextRequest, NextResponse } from "next/server";
import { getAlbumTracks } from "@/lib/album/itunes";

export async function GET(request: NextRequest) {
  const title = request.nextUrl.searchParams.get("title");
  if (!title) {
    return NextResponse.json({ error: "앨범 제목이 필요합니다." }, { status: 400 });
  }

  try {
    const tracks = await getAlbumTracks(title);
    return NextResponse.json(tracks, {
      headers: { "Cache-Control": "public, max-age=0, s-maxage=604800, stale-while-revalidate=86400" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "수록곡을 가져오는데 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
