import TestImage from "@/assets/images/default_image.avif";
import ShareButton from "@/components/common/button/ShareButton";
import Image from "next/image";
import Link from "next/link";
import { IoHeart } from "react-icons/io5";
import { RiMessage2Line } from "react-icons/ri";
import CommentForm from "@/components/board/CommentForm";
import CommentListItems from "@/components/board/CommentListItems";

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
            <Link href="/">목록</Link>
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
        <div className="flex gap-4 mb-5">
          <p className="flex gap-1">
            <IoHeart size={25} />
            <span>3</span>
          </p>
          <p className="flex gap-1">
            <RiMessage2Line size={25} />
            <span>1</span>
          </p>
        </div>
        <div className="flex bg-gray-100 rounded-md py-3 px-5">
          <div className="flex gap-2 items-center">
            <h3 className="relative w-[40px] h-auto overflow-hidden rounded-full">
              <Image src={TestImage} alt="test" className="fill" />
            </h3>
            <h2>익명의아이브</h2>
          </div>
          <div className="flex gap-2 ml-auto text-sm items-center">
            <button>수정</button>
            <button>삭제</button>
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
