import { boardMetadata } from "@/metadata/board/boardMetadata";
import BoardContainer from "@/components/board/BoardContainer";

export const metadata = boardMetadata;

const page = () => {
  return (
    <main className="w-full min-h-screen">
      <section className="max-w-[1320px] m-auto px-5 pt-14 pb-28 lg:px-8">
        <h2 className="text-lg lg:text-xl font-bold mb-5">자유게시판</h2>
        <BoardContainer />
      </section>
    </main>
  );
};

export default page;
