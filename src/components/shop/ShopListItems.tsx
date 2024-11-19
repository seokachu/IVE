"use client";
import Image from "next/image";
import DefaultImage from "@/assets/images/album_img.webp";
import Badge from "@/components/common/Badge";
import { FaStar } from "react-icons/fa";
import { GoHeartFill } from "react-icons/go";
import { useRouter } from "next/navigation";
import { getDiscountedPrice } from "@/utils/calculateDiscount";
import { useEffect, useState } from "react";
import { getAverageRating } from "@/lib/supabase/review";
import type { ShopListItemProps } from "@/types";

const ShopListItems = ({ item }: ShopListItemProps) => {
  const { push } = useRouter();
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchRating = async () => {
      const rating = await getAverageRating(item.id);
      setAverageRating(rating);
    };
    fetchRating();
  }, [item]);

  const onClickDetail = () => {
    push(`/shop/${item.id}`);
  };

  const onClickHeart = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      onClickDetail();
    }
  };

  //할인율 적용
  const price = getDiscountedPrice(item);

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
            src={item.thumbnail || DefaultImage}
            alt="썸네일"
            className="fill group-hover:scale-110 transition-transform duration-300"
            width={250}
            height={250}
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
          <Badge item={item} />
          <h3 className="text-base overflow-hidden overflow-ellipsis whitespace-nowrap">
            {item.title}
          </h3>
          <div className="font-bold flex items-center gap-2 text-xl">
            <span className="text-purple">{item.discount_rate}%</span>
            <span>{price}원</span>
          </div>
          <div className="flex items-center gap-1 text-[#878f91] text-sm">
            <FaStar />
            <span>{averageRating}</span>
          </div>
        </div>
      </li>
    </>
  );
};

export default ShopListItems;
