import TestImage from "@/assets/images/default_image.avif";
import ShareButton from "@/components/common/button/ShareButton";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";
import CommentForm from "@/components/board/CommentForm";
import CommentListItems from "@/components/board/CommentListItems";
import { boardDetailMetadata } from "@/metadata/board/boardDetailMetadata";

export const metadata = boardDetailMetadata;

const page = () => {
  return (
    <main className="w-full min-h-screen">
      <section className="max-w-[1320px] m-auto px-5 pt-14 pb-28 lg:px-8">
        <div className="flex border-b py-5 items-center">
          <div>
            <h2 className="text-lg font-bold">아이브 앨범 너무 비싸요</h2>
            <time className="text-dark-gray text-sm">2024.04.04</time>
          </div>
          <div className="flex gap-3 ml-auto text-sm items-center">
            <ShareButton />
            <Link href="/board">목록</Link>
          </div>
        </div>
        <div className="flex gap-1 text-xs lg:text-sm">
          <span>수정</span>
          <span>삭제</span>
        </div>
        <p className="pt-5 pb-14">
          내용은 없어요 아이브 앨범 깎아주세요 너무 비싸요 돈이 없어요 내용은
          없어요 아이브 앨범 깎아주세요 너무 비싸요 돈이 없어요 내용은 없어요
          아이브 앨범 깎아주세요 너무 비싸요 돈이 없어요 내용은 없어요 아이브
          앨범 깎아주세요 너무 비싸요 돈이 없어요 내용은 없어요 아이브 앨범
          깎아주세요 너무 비싸요 돈이 없어요 내용은 없어요 아이브 앨범
          깎아주세요 너무 비싸요 돈이 없어요 내용은 없어요 아이브 앨범
          깎아주세요 너무 비싸요 돈이 없어요 내용은 없어요 아이브 앨범
          깎아주세요 너무 비싸요 돈이 없어요 내용은 없어요 아이브 앨범
          깎아주세요 너무 비싸요 돈이 없어요 내용은 없어요 아이브 앨범
          깎아주세요 너무 비싸요 돈이 없어요 깎아주세요 너무 비싸요 돈이 없어요
          깎아주세요 너무 비싸요 돈이 없어요 깎아주세요 너무 비싸요 돈이 없어요
          깎아주세요 너무 비싸요 돈이 없어요 깎아주세요 너무 비싸요 돈이 없어요
          깎아주세요 너무 비싸요 돈이 없어요 깎아주세요 너무 비싸요 돈이 없어요
          깎아주세요 너무 비싸요 돈이 없어요 깎아주세요 너무 비싸요 돈이 없어요
        </p>
        <div className="flex items-center justify-center mb-5">
          <button className="flex items-center gap-1 border rounded-lg py-3 px-3">
            <AiOutlineLike size={20} />
            <AiFillLike size={20} />
            <span>3</span>
          </button>
        </div>
        <div className="flex bg-gray-100 rounded-md py-3 px-2 lg:px-5">
          <div className="flex gap-2 items-center">
            <h3 className="relative w-[40px] h-auto overflow-hidden rounded-full">
              <Image src={TestImage} alt="test" className="fill" />
            </h3>
            <h2>익명의아이브</h2>
          </div>
        </div>
        <div className="flex gap-4 mt-5 border-t pt-5 pb-5">
          <p className="font-bold text-lg">댓글 1개</p>
        </div>
        <CommentForm />
        <ul className="text-sm">
          <CommentListItems />
        </ul>
      </section>
    </main>
  );
};

export default page;
