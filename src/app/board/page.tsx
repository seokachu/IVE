import { Suspense } from "react";
import { boardMetadata } from "@/metadata/board/boardMetadata";
import BoardHero from "@/components/board/BoardHero";
import HotBoardCards from "@/components/board/HotBoardCards";
import BoardContainer from "@/components/board/BoardContainer";
import BoardSkeleton from "@/components/common/loading/BoardSkeleton";
import GoTopButton from "@/components/common/button/GoTopButton";
export const metadata = boardMetadata;

const page = () => {
  return (
    <main className="w-full min-h-screen">
      <BoardHero />
      <section className="max-w-content m-auto px-5 lg:px-8 pt-10 lg:pt-12 pb-24 lg:pb-28">
        <HotBoardCards />
        <Suspense fallback={<BoardSkeleton />}>
          <BoardContainer />
        </Suspense>
      </section>
      <GoTopButton />
    </main>
  );
};

export default page;
