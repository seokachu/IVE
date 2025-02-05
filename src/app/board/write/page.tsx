import ActionButton from "@/components/common/button/ActionButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { boardWriteMetadata } from "@/metadata/board/boardWriteMetadata";
import { Label } from "@radix-ui/react-label";

export const metadata = boardWriteMetadata;

const page = () => {
  return (
    <main className="w-full min-h-screen px-5 lg:px-8 pb-28 flex items-center justify-center">
      <section className="w-full max-w-[500px] flex flex-col items-center justify-center">
        <h2 className="font-bold text-base lg:text-lg mb-12">글 작성하기</h2>
        <form className="w-full">
          <Label>제목 : </Label>
          <Input />
          <Label>내용 :</Label>
          <Textarea />
          <ActionButton variant="primary" className="w-full py-2 mt-10">
            등록하기
          </ActionButton>
        </form>
      </section>
    </main>
  );
};

export default page;
