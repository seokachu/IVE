import TestImage from "@/assets/images/album_img.webp";
import Image from "next/image";

const CommentForm = () => {
  return (
    <div className="flex items-center mb-5">
      <h3 className="relative w-[40px] h-auto overflow-hidden rounded-full mr-3 shrink-0">
        <Image src={TestImage} alt="test" className="fill" />
      </h3>
      <textarea
        className="border-b w-full"
        placeholder="댓글을 입력해 주세요."
      />
      <button className="bg-purple rounded-md text-sm py-4 px-5 shrink-0 text-white">
        등록
      </button>
    </div>
  );
};

export default CommentForm;
