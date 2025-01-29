"use client";
import Image from "next/image";
import DefaultImage from "@/assets/images/default_image.avif";
import Badge from "@/components/common/Badge";
import { FaStar } from "react-icons/fa";
import { GoHeartFill } from "react-icons/go";
import { useRouter } from "next/navigation";
import { formatPrice, getDiscountedPrice } from "@/utils/calculateDiscount";
import useWishListWithLocal from "@/hooks/queries/useWishListWithLocal";
import { useAverageRating, useReviewCount } from "@/hooks/queries/useReviews";
import type { ShopListItemProps } from "@/types";

const ShopListItem = ({ item, variant = "shop" }: ShopListItemProps) => {
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

  const SHOP_STYLES = {
    shop: "sm:w-2/6 md:w-[calc(33.333%-0.9rem)] lg:w-[calc(25%-0.95rem)]",
    carousel: "w-full",
  } as const;

  return (
    <li
      onClick={onClickDetail}
      onKeyDown={handleKeyDown}
      className={`${SHOP_STYLES[variant]} md:border p-0 md:p-4 rounded-none md:rounded-lg cursor-pointer md:hover:shadow-lg group mb-7 md:mb-5`}
      role="button"
      tabIndex={0}
    >
      <div className="relative w-full h-auto rounded-none md:rounded-lg overflow-hidden aspect-square border">
        <Image
          src={item.thumbnail || DefaultImage}
          alt="썸네일"
          className="fill group-hover:scale-110 transition-transform duration-300 object-cover w-full"
          width={250}
          height={250}
          loading="lazy"
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
        <div className="mt-2 md:mt-4 mb-1 min-h-[20px]">
          <Badge
            item={{ ...item, review_count: reviewCount }}
            averageRating={averageRating}
          />
        </div>
        <h3 className="text-xs lg:text-base overflow-hidden overflow-ellipsis whitespace-nowrap">
          {item.title}
        </h3>
        <div className="font-bold flex items-start md:items-center sm:gap-1 lg:gap-2 sm:text-sm lg:text-xl">
          <span className="text-purple">{item.discount_rate}%</span>
          <span className="whitespace-nowrap">{formatPrice(price)}원</span>
        </div>
        <div className="flex items-center gap-1 text-[#878f91] sm:text-xs lg:text-sm">
          <FaStar />
          <span>{averageRating}</span>
        </div>
      </div>
    </li>
  );
};

export default ShopListItem;
