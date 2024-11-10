"use client";
import Image from "next/image";
import TestImage from "@/assets/images/test.webp";
import Badge from "@/components/common/Badge";
import { FaStar } from "react-icons/fa";
import { GoHeartFill } from "react-icons/go";
import { useRouter } from "next/navigation";

const ShopListItems = () => {
  const { push } = useRouter();

  const onClickDetail = () => {
    push(`/shop/${1}`);
  };

  const onClickHeart = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      onClickDetail();
    }
  };

  return (
    <>
      <li
        onClick={onClickDetail}
        onKeyDown={handleKeyDown}
        className="w-[280px] border p-4 rounded-lg cursor-pointer hover:shadow-lg group mb-10"
        role="button"
        tabIndex={0}
      >
        <div className="relative w-full h-auto rounded-lg overflow-hidden border">
          <Image
            src={TestImage}
            alt="앨범"
            className="fill group-hover:scale-110 transition-transform duration-300"
          />
          <button
            onClick={onClickHeart}
            className="absolute right-2 bottom-2 text-dark-gray"
            aria-label="찜하기"
          >
            <GoHeartFill size={30} className="opacity-90" />
          </button>
        </div>
        <div className="flex flex-col gap-1">
          <Badge />
          <h3 className="text-base overflow-hidden overflow-ellipsis whitespace-nowrap">
            SWITCH 앨범제목!
          </h3>
          <div className="font-bold flex items-center gap-2 text-xl">
            <span className="text-purple">10%</span>
            <span className="">45,000 원</span>
          </div>
          <div className="flex items-center gap-1 text-[#878f91] text-sm">
            <FaStar />
            <span>4.8</span>
          </div>
        </div>
      </li>
    </>
  );
};

export default ShopListItems;
