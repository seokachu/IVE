import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { fetchItunesAlbums, normalizeAlbumTitle } from "@/lib/album/sync";

export const dynamic = "force-dynamic";

//매일 Vercel Cron이 호출 — iTunes에서 새 발매반을 감지해 album 테이블에 자동 추가
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "인증에 실패했습니다." }, { status: 401 });
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return NextResponse.json({ error: "앨범 저장 설정이 완료되지 않았습니다." }, { status: 500 });
  }

  try {
    const itunesAlbums = await fetchItunesAlbums();

    const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const { data: existing, error: selectError } = await admin.from("album").select("title");
    if (selectError) throw new Error(selectError.message);

    const existingTitles = new Set((existing || []).map((row) => normalizeAlbumTitle(row.title)));
    const fresh = itunesAlbums.filter((album) => !existingTitles.has(normalizeAlbumTitle(album.title)));

    if (fresh.length > 0) {
      const { error: insertError } = await admin.from("album").insert(fresh);
      if (insertError) throw new Error(insertError.message);
    }

    return NextResponse.json({ scanned: itunesAlbums.length, inserted: fresh.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "앨범 동기화에 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
