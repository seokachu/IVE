import { newsMetadata } from "@/metadata/news/newsMetadata";
import { GALLERY_DEFAULT_LIMIT, LATEST_DEFAULT_LIMIT } from "@/utils/constants";
import HeroSection from "@/components/news/HeroSection";
import GoTopButton from "@/components/common/button/GoTopButton";
import LatestNewsSection from "@/components/news/LatestNewsSection";
import GallerySection from "@/components/news/GallerySection";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getNewsGallery } from "@/lib/supabase/news";
import { getGallery } from "@/lib/supabase/gallery";

export const metadata = newsMetadata;
export const revalidate = 60 * 60 * 24;

const page = async () => {
  const queryClient = new QueryClient();

  //데이터 prefetch
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["news", LATEST_DEFAULT_LIMIT],
      queryFn: () => getNewsGallery(LATEST_DEFAULT_LIMIT),
    }),

    queryClient.prefetchQuery({
      queryKey: ["gallery", GALLERY_DEFAULT_LIMIT],
      queryFn: () => getGallery(GALLERY_DEFAULT_LIMIT),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main>
        <HeroSection />
        <LatestNewsSection />
        <GallerySection />
        <GoTopButton />
      </main>
    </HydrationBoundary>
  );
};

export default page;
