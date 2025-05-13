import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getAlbums } from "@/lib/supabase/album";
import AlbumSection from "@/components/main/AlbumSection";
import VisualSection from "@/components/main/VisualSection";
import BoardSection from "@/components/main/BoardSection";
import GoodsPromoSection from "@/components/main/GoodsPromoSection";
import ShopSection from "@/components/main/ShopSection";
import GoTopButton from "@/components/common/button/GoTopButton";

export const revalidate = 60 * 60 * 24;

export default async function Home() {
  const queryClient = new QueryClient();

  //데이터 prefetch
  await queryClient.prefetchQuery({
    queryKey: ["albums"],
    queryFn: getAlbums,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main>
        <div className="relative min-h-[100vh]">
          <VisualSection />
          <AlbumSection />
        </div>
        <div className="relative z-10 bg-white">
          <BoardSection />
          <GoodsPromoSection />
          <ShopSection />
        </div>
        <GoTopButton />
      </main>
    </HydrationBoundary>
  );
}
