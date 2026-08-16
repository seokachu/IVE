import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getAlbums } from "@/lib/supabase/album";
import { getNewsFeed } from "@/lib/news/feed";
import { getScheduleFeed } from "@/lib/schedule/feed";
import AlbumSection from "@/components/main/AlbumSection";
import VisualSection from "@/components/main/VisualSection";
import MarqueeStrip from "@/components/main/MarqueeStrip";
import NewsPreviewSection from "@/components/main/NewsPreviewSection";
import HotBoardSection from "@/components/main/HotBoardSection";
import ShopSection from "@/components/main/ShopSection";
import GoTopButton from "@/components/common/button/GoTopButton";

export const revalidate = 1800;

//히어로 배경용 최신 공식 영상 (쇼츠 제외)
const pickHeroVideoId = (feed: Awaited<ReturnType<typeof getNewsFeed>>) => {
  const video = feed.find(
    (item) => item.sourceType === "youtube" && !/shorts/i.test(item.title)
  );
  return video?.url.match(/[?&]v=([\w-]+)/)?.[1] || null;
};

export default async function Home() {
  const queryClient = new QueryClient();

  //데이터 prefetch
  const [feed] = await Promise.all([
    getNewsFeed().catch(() => []),
    queryClient.prefetchQuery({ queryKey: ["albums"], queryFn: getAlbums }),
    queryClient.prefetchQuery({ queryKey: ["scheduleFeed"], queryFn: getScheduleFeed }),
  ]);
  queryClient.setQueryData(["newsFeed"], feed);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main>
        <VisualSection videoId={pickHeroVideoId(feed)} />
        <MarqueeStrip />
        <AlbumSection />
        <div className="relative z-10 bg-background">
          <NewsPreviewSection />
          <HotBoardSection />
          <ShopSection />
        </div>
        <GoTopButton />
      </main>
    </HydrationBoundary>
  );
}
