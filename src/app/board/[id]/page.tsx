import TestImage from "@/assets/images/default_image.avif";
import ShareButton from "@/components/common/button/ShareButton";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";
import CommentForm from "@/components/board/CommentForm";
import CommentListItems from "@/components/board/CommentListItems";
import { boardDetailMetadata } from "@/metadata/board/boardDetailMetadata";
import ActionButton from "@/components/common/button/ActionButton";

export const metadata = boardDetailMetadata;

const page = () => {
  return (
    <main className="w-full min-h-screen">
      <section className="max-w-[1320px] m-auto px-5 pb-28 lg:px-8">
        <div className="flex border-b py-5 items-center">
          <div>
            <h2 className="text-lg font-bold">아이브 앨범 너무 비싸요</h2>
            <time className="text-gray-500 text-sm">2024.04.04</time>
            <span className="ml-2 text-sm text-gray-500">조회 1</span>
          </div>
          <div className="flex flex-col ml-auto justify-end">
            <div className="flex gap-3 text-sm items-center">
              <ShareButton />
              <Link href="/board" className="hover:text-purple">
                목록
              </Link>
            </div>
            <div className="flex justify-end items-center gap-1 text-sm pt-3">
              <ActionButton
                variant="default"
                className="border-none text-gray-500 mr-1"
              >
                수정
              </ActionButton>
              <ActionButton
                variant="default"
                className="border-none text-gray-500"
              >
                삭제
              </ActionButton>
            </div>
          </div>
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
          <ActionButton
            variant="default"
            className="flex items-center gap-1 py-3 px-3 hover:bg-silver-gray"
          >
            <AiOutlineLike size={20} />
            <AiFillLike size={20} />
            <span>3</span>
          </ActionButton>
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
          <p className="font-bold">댓글 1개</p>
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
