import BoardDetailContainer from "@/components/board/detail/BoardDetailContainer";
import GoTopButton from "@/components/common/button/GoTopButton";
import { generateMetadata } from "@/metadata/board/boardDetailMetadata";
import type { BoardDetailPageParams } from "@/types/board";

export { generateMetadata };

const page = async ({ params }: BoardDetailPageParams) => {
  const { id } = await params;
  return (
    <main className="w-full min-h-screen">
      <section className="max-w-content m-auto px-5 pb-24 lg:pb-28 lg:px-8">
        <BoardDetailContainer boardId={parseInt(id)} />
      </section>
      <GoTopButton />
    </main>
  );
};

export default page;
