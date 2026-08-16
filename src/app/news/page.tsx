import { newsMetadata } from "@/metadata/news/newsMetadata";
import GoTopButton from "@/components/common/button/GoTopButton";
import NewsHero from "@/components/news/NewsHero";
import NewsFeedSection from "@/components/news/NewsFeedSection";
import ScheduleSection from "@/components/news/ScheduleSection";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getNewsFeed } from "@/lib/news/feed";
import { getScheduleFeed } from "@/lib/schedule/feed";

export const metadata = newsMetadata;
export const revalidate = 1800;

const page = async () => {
  const queryClient = new QueryClient();

  //데이터 prefetch
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["newsFeed"],
      queryFn: getNewsFeed,
    }),

    queryClient.prefetchQuery({
      queryKey: ["scheduleFeed"],
      queryFn: getScheduleFeed,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main>
        <NewsHero />
        <ScheduleSection />
        <NewsFeedSection type="video" />
        <NewsFeedSection type="article" />
        <GoTopButton />
      </main>
    </HydrationBoundary>
  );
};

export default page;
