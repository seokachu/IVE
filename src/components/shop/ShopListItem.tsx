"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import DefaultImage from "@/assets/images/default_image.avif";
import Badge from "@/components/common/Badge";
import { Heart, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatPrice, getDiscountedPrice } from "@/utils/calculateDiscount";
import useWishListWithLocal from "@/hooks/queries/useWishListWithLocal";
import { useMyMembership } from "@/hooks/queries/useMembership";
import { getMembershipDiscount } from "@/lib/supabase/membership";
import MembershipBadge from "@/components/mypage/MembershipBadge";
import type { ShopListItemProps } from "@/types/shop";

//시안 기준: 목록·캐러셀 공통 카드 — 보더 없는 카드, 배지·하트는 이미지 위 오버레이
const ShopListItem = ({ item, variant = "shop", index = 0 }: ShopListItemProps) => {
  const { push } = useRouter();
  const { isWished, toggleWishList } = useWishListWithLocal(item.id);
  const { tier } = useMyMembership();

  //리뷰 수·평균 별점은 목록 조회에 포함되어 상품별 추가 요청이 없다
  const averageRating = item.average_rating;

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
  //구독자에게는 멤버십 상시 할인가를 함께 표시 (결제 시 실제 적용되는 금액과 동일 계산)
  const memberPrice = price - getMembershipDiscount(tier, price);

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
      className="w-full cursor-pointer group"
      tabIndex={0}
      aria-label={`상품: ${item.title}, 가격: ${item.price}원, 할인율: ${item.discount_rate}%`}
      data-testid="shop-item"
      data-detail-path={`/shop/${item.id}`}
    >
      <div className="relative w-full h-auto rounded-lg overflow-hidden aspect-square bg-gray-100 border border-gray-200">
        <Image
          src={item.thumbnail || DefaultImage}
          alt={item.title || "상품 썸네일 이미지"}
          className="group-hover:scale-110 transition-transform duration-300 object-cover w-full"
          width={250}
          height={250}
          loading={variant === "shop" && index < 6 ? "eager" : "lazy"}
          priority={variant === "shop" && index < 6}
        />
        <div className="absolute top-2.5 left-2.5">
          <Badge item={item} averageRating={averageRating} />
        </div>
        <Button
          variant="plain"
          size="auto"
          onClick={onClickHeart}
          className="absolute right-2.5 top-2.5 flex items-center justify-center w-9 h-9 rounded-full bg-white/90 border border-[#EEEEEE]"
          aria-label="찜하기"
        >
          <Heart
            size={17}
            fill={isWished ? "currentColor" : "none"}
            className={`transition-colors ${isWished ? "text-red" : "text-gray-500"}`}
          />
        </Button>
      </div>
      <div className="flex flex-col gap-1 mt-2.5">
        <h3 className="overflow-hidden overflow-ellipsis whitespace-nowrap text-sm font-semibold">{item.title}</h3>
        <div className="font-bold flex items-center flex-wrap gap-x-1.5 lg:gap-x-2 text-[15px]">
          {(item.discount_rate ?? 0) > 0 && <span className="text-orange-500">{item.discount_rate}%</span>}
          <span className="whitespace-nowrap">{formatPrice(price)}원</span>
          <span className="flex items-center gap-1 text-gray-400 text-xs font-normal">
            <Star size={13} className="text-warning fill-warning" />
            {averageRating}
          </span>
        </div>
        {tier !== "free" && (
          <div className="flex items-center gap-1.5">
            <MembershipBadge tier={tier} size="sm" />
            <span className="text-[13px] font-bold text-purple-500 dark:text-purple-300">
              {formatPrice(memberPrice)}원
            </span>
          </div>
        )}
      </div>
    </Tag>
  );
};

export default ShopListItem;
