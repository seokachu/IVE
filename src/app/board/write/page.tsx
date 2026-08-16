import Link from "next/link";
import { ChevronLeft, PencilLine } from "lucide-react";
import BoardWriteForm from "@/components/board/write/BoardWriteForm";
import { boardWriteMetadata } from "@/metadata/board/boardWriteMetadata";

export const metadata = boardWriteMetadata;

const page = () => {
  return (
    <main className="w-full px-5 lg:px-8 pb-14">
      <div className="max-w-[800px] m-auto flex flex-col gap-6 lg:gap-7 pt-6 lg:pt-8">
        <div>
          <Link
            href="/board"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 text-[13px] font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={14} />
            목록으로
          </Link>
        </div>
        <div className="flex flex-col gap-2.5">
          <span className="self-start flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-500 text-xs font-semibold">
            <PencilLine size={12} />
            자유게시판
          </span>
          <h1 className="text-[28px] font-bold leading-tight">글 작성하기</h1>
          <p className="text-sm text-gray-500">
            다이브에게 들려주고 싶은 이야기를 자유롭게 남겨 주세요.
          </p>
        </div>
        <hr className="border-gray-200" />
        <BoardWriteForm mode="create" />
      </div>
    </main>
  );
};

export default page;
