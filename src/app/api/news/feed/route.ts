import { NextResponse } from "next/server";
import { getNewsFeed, FEED_REVALIDATE_SECONDS } from "@/lib/news/feed";

export const revalidate = 1800;

export async function GET() {
  try {
    const feed = await getNewsFeed();
    return NextResponse.json(feed, {
      headers: { "Cache-Control": `public, s-maxage=${FEED_REVALIDATE_SECONDS}, stale-while-revalidate=86400` },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "뉴스 피드를 가져오는데 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
