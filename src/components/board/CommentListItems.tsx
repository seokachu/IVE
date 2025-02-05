import TestImage from "@/assets/images/default_image.avif";
import Image from "next/image";
import { AiOutlineLike } from "react-icons/ai";
import ActionButton from "../common/button/ActionButton";

const CommentListItems = () => {
  return (
    <li className="py-5">
      <div className="flex gap-2 items-center">
        <h3 className="relative w-[40px] h-auto overflow-hidden rounded-full border">
          <Image src={TestImage} alt="test" className="fill" />
        </h3>
        <div>
          <div className="flex gap-2">
            <h2>익명의아이브</h2>
            <time className="text-dark-gray">2024.04.04</time>
          </div>
          <p className="text-sm">
            뭐 거진 대부분 돈이 없죠 돈이 없어서 문제예요 흑흑...
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 pl-12 mt-1">
        <p className="flex items-center gap-1">
          <AiOutlineLike size={15} />
          <span>0</span>
        </p>
        <ActionButton variant="default" className="border-none">
          답변
        </ActionButton>
      </div>
    </li>
  );
};

export default CommentListItems;
