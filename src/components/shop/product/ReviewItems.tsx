import Image from "next/image";
import { FaRegStar } from "react-icons/fa";
import TestImage from "@/assets/images/default_image.avif";

const ReviewItems = () => {
  return (
    <li className="border-b py-6">
      <div className="flex gap-4 justify-between items-center">
        <div className="flex gap-3">
          <div className="relative w-[50px] h-auto overflow-hidden rounded-full">
            <Image src={TestImage} alt="test" />
          </div>
          <div>
            <h3 className="font-bold">아이브짱</h3>
            <div className="flex gap-1 items-center justify-center">
              <div className="flex">
                <FaRegStar size={15} />
                <FaRegStar size={15} />
                <FaRegStar size={15} />
                <FaRegStar size={15} />
                <FaRegStar size={15} />
              </div>
              <strong className="-translate-y-[1px]">5</strong>
            </div>
          </div>
        </div>
        <time className="text-dark-gray text-sm">2024.04.04</time>
      </div>
      <p className="mt-3 px-2">
        내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다
      </p>
    </li>
  );
};

export default ReviewItems;
