"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import DefaultImage from "@/assets/images/default_image.avif";
import Badge from "@/components/common/Badge";
import { Heart, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatPrice, getDiscountedPrice } from "@/utils/calculateDiscount";
import useWishListWithLocal from "@/hooks/queries/useWishListWithLocal";
import { useAverageRating, useReviewCount } from "@/hooks/queries/useReviews";
import type { ShopListItemProps } from "@/types/shop";

const SHOP_STYLES = {
  shop: "w-2/6 md:w-[calc(33.333%-0.9rem)] lg:w-[calc(25%-0.95rem)] mb-7 md:mb-5 md:border p-0 md:p-4 md:rounded-lg md:hover:shadow-lg",
  //메인 캐러셀: 시안 기준 — 보더 없는 카드, 배지·하트는 이미지 위 오버레이
  carousel: "w-full",
} as const;

const ShopListItem = ({ item, variant = "shop", index = 0 }: ShopListItemProps) => {
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

  //carousel에서는 SwiperSlide(li)가 감싸므로 li 중첩을 피하기 위해 div로 렌더링
  const Tag = variant === "carousel" ? "div" : "li";

  return (
    <Tag
      onClick={onClickDetail}
      onKeyDown={handleKeyDown}
      className={`${SHOP_STYLES[variant]} cursor-pointer group`}
      tabIndex={0}
      aria-label={`상품: ${item.title}, 가격: ${item.price}원, 할인율: ${item.discount_rate}%`}
      data-testid="shop-item"
      data-detail-path={`/shop/${item.id}`}
    >
      <div
        className={`relative w-full h-auto rounded-lg overflow-hidden aspect-square ${
          variant === "carousel" ? "bg-gray-100" : "border"
        }`}
      >
        <Image
          src={item.thumbnail || DefaultImage}
          alt={item.title || "상품 썸네일 이미지"}
          className="fill group-hover:scale-110 transition-transform duration-300 object-cover w-full"
          width={250}
          height={250}
          loading={variant === "shop" && index < 6 ? "eager" : "lazy"}
          priority={variant === "shop" && index < 6}
        />
        {variant === "carousel" && (
          <div className="absolute top-2.5 left-2.5">
            <Badge item={{ ...item, review_count: reviewCount }} averageRating={averageRating} />
          </div>
        )}
        {variant === "carousel" ? (
          <Button
            variant="plain"
            size="auto"
            onClick={onClickHeart}
            className="absolute right-2.5 top-2.5 flex items-center justify-center w-9 h-9 rounded-full bg-white/90 shadow-sm"
            aria-label="찜하기"
          >
            <Heart
              size={17}
              fill={isWished ? "currentColor" : "none"}
              className={`transition-colors ${isWished ? "text-red" : "text-gray-500"}`}
            />
          </Button>
        ) : (
          <Button variant="plain" size="auto" onClick={onClickHeart} className="absolute right-2 bottom-2 text-gray-300" aria-label="찜하기">
            <Heart fill="currentColor"
              size={30}
              className={`opacity-90 transition-colors ${isWished ? "text-red" : "text-gray-300"}`}
            />
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-1">
        {variant === "shop" && (
          <div className="mt-2 md:mt-4 mb-1 min-h-[20px]">
            <Badge item={{ ...item, review_count: reviewCount }} averageRating={averageRating} />
          </div>
        )}
        <h3 className="text-xs lg:text-base overflow-hidden overflow-ellipsis whitespace-nowrap">{item.title}</h3>
        <div className="font-bold flex items-start md:items-center gap-1 lg:gap-2 text-sm lg:text-xl">
          <span className="text-purple">{item.discount_rate}%</span>
          <span className="whitespace-nowrap">{formatPrice(price)}원</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400 text-xs lg:text-sm">
          <Star />
          <span>{averageRating}</span>
        </div>
      </div>
    </Tag>
  );
};

export default ShopListItem;
