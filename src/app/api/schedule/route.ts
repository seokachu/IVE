import { NextResponse } from "next/server";
import { getScheduleFeed } from "@/lib/schedule/feed";

export const revalidate = 1800;

export async function GET() {
  try {
    const schedules = await getScheduleFeed();
    return NextResponse.json(schedules, {
      headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "일정을 가져오는데 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
