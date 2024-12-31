"use client";
import Image from "next/image";
import DefaultImage from "@/assets/images/default_image.avif";
import Badge from "@/components/common/Badge";
import { FaStar } from "react-icons/fa";
import { GoHeartFill } from "react-icons/go";
import { useRouter } from "next/navigation";
import { formatPrice, getDiscountedPrice } from "@/utils/calculateDiscount";
import useWishListWithLocal from "@/hooks/queries/useWishListWithLocal";
import type { ShopListItemProps } from "@/types";
import { useAverageRating, useReviewCount } from "@/hooks/queries/useReviews";

const ShopListItem = ({ item }: ShopListItemProps) => {
  const { push } = useRouter();
  const { data: reviewData } = useReviewCount(item.id);
  const { data: averageRating = 0 } = useAverageRating(item.id);
  const { isWished, toggleWishList } = useWishListWithLocal(item.id);

  const reviewCount = reviewData?.length || 0;

  const onClickDetail = () => {
    push(`/shop/${item.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      onClickDetail();
    }
  };

  //할인율 적용
  const price = getDiscountedPrice(item);

  //찜하기 버튼
  const onClickHeart = (e: React.MouseEvent) => {
    e.stopPropagation(); //상품 클릭 이벤트 전파 방지용
    toggleWishList();
  };

  return (
    <li
      onClick={onClickDetail}
      onKeyDown={handleKeyDown}
      className="w-[90%] sm:w-[280px] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.2rem)] border p-4 rounded-lg cursor-pointer hover:shadow-lg group mb-5"
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
          <GoHeartFill
            size={30}
            className={`opacity-90 transition-colors ${
              isWished ? "text-rose-500" : "text-dark-gray"
            }`}
          />
        </button>
      </div>
      <div className="flex flex-col gap-1">
        <div className="mt-4 mb-1 min-h-[20px]">
          <Badge
            item={{ ...item, review_count: reviewCount }}
            averageRating={averageRating}
          />
        </div>
        <h3 className="text-base overflow-hidden overflow-ellipsis whitespace-nowrap">
          {item.title}
        </h3>
        <div className="font-bold flex items-center gap-2 text-xl">
          <span className="text-purple">{item.discount_rate}%</span>
          <span>{formatPrice(price)}원</span>
        </div>
        <div className="flex items-center gap-1 text-[#878f91] text-sm">
          <FaStar />
          <span>{averageRating}</span>
        </div>
      </div>
    </li>
  );
};

export default ShopListItem;
