import { Suspense } from "react";
import { boardMetadata } from "@/metadata/board/boardMetadata";
import BoardContainer from "@/components/board/BoardContainer";
import BoardSkeleton from "@/components/common/loading/BoardSkeleton";
export const metadata = boardMetadata;

const page = () => {
  return (
    <main className="w-full min-h-screen">
      <section className="max-w-[1320px] m-auto pt-14 pb-28 lg:px-8">
        <Suspense fallback={<BoardSkeleton />}>
          <BoardContainer />
        </Suspense>
      </section>
    </main>
  );
};

export default page;
