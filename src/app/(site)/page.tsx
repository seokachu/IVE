import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getAlbums } from "@/lib/supabase/album";
import { getNewsFeed } from "@/lib/news/feed";
import { resolveHeroVideoId } from "@/lib/news/heroVideo";
import { getScheduleFeed } from "@/lib/schedule/feed";
import AlbumSection from "@/components/main/AlbumSection";
import VisualSection from "@/components/main/VisualSection";
import MarqueeStrip from "@/components/main/MarqueeStrip";
import NewsPreviewSection from "@/components/main/NewsPreviewSection";
import HotBoardSection from "@/components/main/HotBoardSection";
import ShopSection from "@/components/main/ShopSection";
import GoTopButton from "@/components/common/button/GoTopButton";
import { getSiteOrigin } from "@/utils/siteOrigin";

export const revalidate = 1800;

export default async function Home() {
  const queryClient = new QueryClient();

  //데이터 prefetch
  const [feed] = await Promise.all([
    getNewsFeed().catch(() => []),
    queryClient.prefetchQuery({ queryKey: ["albums"], queryFn: getAlbums }),
    queryClient.prefetchQuery({ queryKey: ["scheduleFeed"], queryFn: getScheduleFeed }),
  ]);
  queryClient.setQueryData(["newsFeed"], feed);
  //히어로 배경 영상 — 피드가 비어 와도(유튜브 쓰로틀) 마지막 성공 영상으로 폴백해 정적 이미지로 떨어지지 않게
  const heroVideoId = await resolveHeroVideoId(feed);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main>
        <VisualSection videoId={heroVideoId} siteOrigin={getSiteOrigin()} />
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
