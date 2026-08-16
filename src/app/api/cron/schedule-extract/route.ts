import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getNewsFeed } from "@/lib/news/feed";
import { extractSchedules } from "@/lib/schedule/extract";

export const dynamic = "force-dynamic";

//매일 Vercel Cron이 호출 — 뉴스 피드에서 날짜가 명시된 일정을 추출해 초안으로 저장
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "인증에 실패했습니다." }, { status: 401 });
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return NextResponse.json({ error: "일정 저장 설정이 완료되지 않았습니다." }, { status: 500 });
  }

  try {
    const feedItems = await getNewsFeed();
    const candidates = extractSchedules(feedItems);

    const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey, {
      auth: { persistSession: false },
    });

    //같은 카테고리 + 같은 시작일이 이미 있으면 중복으로 간주 (기사마다 제목이 달라 제목 비교는 불가)
    const { data: existing, error: selectError } = await admin.from("schedules").select("category, starts_at");
    if (selectError) throw new Error(selectError.message);

    const seen = new Set((existing || []).map((row) => `${row.category}|${row.starts_at.slice(0, 10)}`));
    const fresh = candidates.filter((item) => {
      const key = `${item.category}|${item.startsAt.slice(0, 10)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    if (fresh.length > 0) {
      const { error: insertError } = await admin.from("schedules").insert(
        fresh.map((item) => ({
          title: item.title,
          category: item.category,
          starts_at: item.startsAt,
          ends_at: item.endsAt,
          link: item.link,
          description: item.description,
          source: "auto",
        }))
      );
      if (insertError) throw new Error(insertError.message);
    }

    return NextResponse.json({ scanned: feedItems.length, extracted: candidates.length, inserted: fresh.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "일정 추출에 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
