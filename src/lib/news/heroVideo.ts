import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { FeedItem } from "@/types/news";

//메인 히어로 배경 영상 결정.
//유튜브 RSS는 쓰로틀로 가끔 비어 오는데, 메인은 30분 ISR이라 그 순간 재생성된 페이지는 30분 내내
//정적 이미지 폴백으로 서빙됐다. Next 데이터 캐시는 재생성 시 stale 항목을 foreground로 다시 받기 때문에
//실패를 못 메운다 — 그래서 마지막으로 성공한 영상을 site_state 테이블에 기억해 두고 폴백한다.

const SITE_STATE_TABLE = "site_state";
const HERO_VIDEO_KEY = "hero_video";
//Supabase가 늦어도 페이지 생성을 붙들지 않도록 짧게 끊는다
const STATE_TIMEOUT_MS = 3000;

interface HeroVideo {
  videoId: string;
  title: string;
  publishedAt: string;
}

//피드의 최신 영상(쇼츠 제외) — 없으면 null
export const pickHeroVideo = (feed: FeedItem[]): HeroVideo | null => {
  const item = feed.find((entry) => entry.sourceType === "youtube" && !/shorts/i.test(entry.title));
  const videoId = item?.url.match(/[?&]v=([\w-]+)/)?.[1];
  return item && videoId ? { videoId, title: item.title, publishedAt: item.publishedAt } : null;
};

//서비스롤이 있으면 읽기·쓰기, 없으면(로컬 등) 공개 읽기 정책으로 읽기만
let stateClient: { client: SupabaseClient; canWrite: boolean } | null | undefined;

const getStateClient = () => {
  if (stateClient !== undefined) return stateClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const key = serviceRoleKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  stateClient =
    url && key
      ? { client: createClient(url, key, { auth: { persistSession: false } }), canWrite: !!serviceRoleKey }
      : null;
  return stateClient;
};

//마지막 성공 영상 저장 — 메인 재생성(30분)마다 한 번이라 값 비교 없이 upsert
const rememberHeroVideo = async (video: HeroVideo) => {
  const state = getStateClient();
  if (!state?.canWrite) return;

  try {
    const { error } = await state.client
      .from(SITE_STATE_TABLE)
      .upsert({ key: HERO_VIDEO_KEY, value: video, updated_at: new Date().toISOString() }, { onConflict: "key" })
      .abortSignal(AbortSignal.timeout(STATE_TIMEOUT_MS));
    if (error) console.error("[hero] 마지막 영상 저장 실패", error);
  } catch (error) {
    console.error("[hero] 마지막 영상 저장 실패", error);
  }
};

const recallHeroVideo = async (): Promise<HeroVideo | null> => {
  const state = getStateClient();
  if (!state) return null;

  try {
    const { data, error } = await state.client
      .from(SITE_STATE_TABLE)
      .select("value")
      .eq("key", HERO_VIDEO_KEY)
      .abortSignal(AbortSignal.timeout(STATE_TIMEOUT_MS))
      .maybeSingle();
    if (error) {
      console.error("[hero] 마지막 영상 조회 실패", error);
      return null;
    }
    const value = data?.value as Partial<HeroVideo> | null | undefined;
    return value?.videoId ? (value as HeroVideo) : null;
  } catch (error) {
    console.error("[hero] 마지막 영상 조회 실패", error);
    return null;
  }
};

//피드에 영상이 있으면 그걸 쓰면서 기억해 두고, 없으면(수집 실패) 기억해 둔 영상으로 폴백한다
export const resolveHeroVideoId = async (feed: FeedItem[]): Promise<string | null> => {
  const fresh = pickHeroVideo(feed);
  if (fresh) {
    await rememberHeroVideo(fresh);
    return fresh.videoId;
  }

  const remembered = await recallHeroVideo();
  console.error(
    remembered
      ? `[hero] 피드에 영상이 없어 마지막 성공 영상으로 폴백 (${remembered.videoId})`
      : "[hero] 피드에 영상이 없고 기억해 둔 영상도 없음 — 정적 이미지 폴백"
  );
  return remembered?.videoId ?? null;
};
