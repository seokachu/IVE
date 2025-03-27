import BoardWriteForm from "@/components/board/write/BoardWriteForm";
import { boardEditMetadata } from "@/metadata/board/boardEditMetadata";
import type { EditPageParams } from "@/types/board";

export const metadata = boardEditMetadata;

const page = ({ params }: EditPageParams) => {
  return (
    <main className="w-full min-h-screen px-5 lg:px-8 pb-28 flex items-center justify-center">
      <section className="w-full max-w-[1320px] flex flex-col items-center justify-center sm:-mt-20 md:mt-0">
        <h2 className="font-bold text-base lg:text-lg mb-12">글 수정하기</h2>
        <BoardWriteForm mode="edit" boardId={Number(params.id)} />
      </section>
    </main>
  );
};

export default page;
