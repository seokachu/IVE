import { readSiteState, writeSiteState } from "@/lib/siteState";
import type { FeedItem } from "@/types/news";

//메인 히어로 배경 영상 결정.
//유튜브 RSS는 쓰로틀로 가끔 비어 오는데, 메인은 30분 ISR이라 그 순간 재생성된 페이지는 30분 내내
//정적 이미지 폴백으로 서빙됐다. Next 데이터 캐시는 재생성 시 stale 항목을 foreground로 다시 받기 때문에
//실패를 못 메운다 — 그래서 마지막으로 성공한 영상을 site_state 테이블에 기억해 두고 폴백한다.

const HERO_VIDEO_KEY = "hero_video";

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

const rememberHeroVideo = (video: HeroVideo) => writeSiteState(HERO_VIDEO_KEY, video);

const recallHeroVideo = async (): Promise<HeroVideo | null> => {
  const value = await readSiteState<Partial<HeroVideo>>(HERO_VIDEO_KEY);
  return value?.videoId ? (value as HeroVideo) : null;
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
