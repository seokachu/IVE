import { boardWriteMetadata } from "@/metadata/board/boardWriteMetadata";
import BoardWriteForm from "@/components/board/BoardWriteForm";

export const metadata = boardWriteMetadata;

const page = () => {
  return (
    <main className="w-full min-h-screen px-5 lg:px-8 pb-28 flex items-center justify-center">
      <section className="w-full max-w-[500px] flex flex-col items-center justify-center">
        <h2 className="font-bold text-base lg:text-lg mb-12">글 작성하기</h2>
        <BoardWriteForm />
      </section>
    </main>
  );
};

export default page;
