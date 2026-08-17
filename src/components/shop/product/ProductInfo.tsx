import Link from "next/link";
import ProductActions from "./ProductActions";
import ProductGallery from "./ProductGallery";
import Badge from "@/components/common/Badge";
import MembershipBadge from "@/components/mypage/MembershipBadge";
import { useMyMembership } from "@/hooks/queries/useMembership";
import { MEMBERSHIP_DISCOUNT_RATES, getMembershipDiscount } from "@/lib/supabase/membership";
import ShareButton from "@/components/common/button/ShareButton";
import Error from "@/components/common/error/Error";
import ProductInfoSkeleton from "@/components/common/loading/ProductInfoSkeleton";
import { Button } from "@/components/ui/button";
import { useShopDetail } from "@/hooks/queries/useShops";
import { useAverageRating, useReviewCount } from "@/hooks/queries/useReviews";
import { formatPrice, getDiscountedPrice } from "@/utils/calculateDiscount";
import { countRecentReviews } from "@/utils/calculateBadge";
import { toast } from "@/hooks/use-toast";
import { ArrowRight, Minus, Package, Plus, Sparkles, Star, Truck } from "lucide-react";
import { useState } from "react";
import type { ShopMenuProps } from "@/types/shop";

interface ProductInfoProps extends ShopMenuProps {
  onClickReview?: () => void;
}

const ProductInfo = ({ id, onClickReview }: ProductInfoProps) => {
  const [count, setCount] = useState(1);

  const { data, isLoading, isError } = useShopDetail(id);
  const { data: averageRating } = useAverageRating(id);
  const { data: reviews } = useReviewCount(id);
  const { tier } = useMyMembership();

  if (isLoading) return <ProductInfoSkeleton />;
  if (isError) return <Error />;

  const price = getDiscountedPrice(data);
  //멤버십 상시 할인가 — 구독자는 본인 티어 적용가, 미구독자는 DIVE+ 가입 시 가격으로 유도
  const memberPrice = price - getMembershipDiscount(tier, price);
  const plusPrice = price - getMembershipDiscount("plus", price);
  const totalPrice = price * count;
  const reviewCount = reviews?.length ?? 0;
  const rating = averageRating ?? 0;
  //HOT은 최근 반응 기준이라 목록과 동일하게 최근 리뷰 수로 판정한다
  const recentReviewCount = countRecentReviews(reviews);

  //갤러리: 썸네일 + 상세 이미지 목록 (같은 URL 중복 제거 — 슬라이드에 같은 사진이 두 번 나오지 않도록)
  const detailImages = Array.isArray(data.images) ? (data.images as string[]) : [];
  const galleryImages = [...new Set([data.thumbnail, ...detailImages])].filter((image): image is string =>
    Boolean(image),
  );

  const handleIncrease = () => {
    if (count >= 5) {
      toast({
        title: "최대 5개 까지 구매 가능합니다.",
        variant: "warning",
      });
      return;
    }
    setCount((prev) => Math.min(prev + 1, 5));
  };

  const handleDecrease = () => {
    if (count > 1) {
      setCount((prev) => Math.max(prev - 1, 1));
    }
  };

  return (
    //시안 기준: 브랜드 컬러 단색 배경 위 갤러리 + 플로팅 구매 카드 히어로
    <div className="relative w-full overflow-hidden bg-purple-50">
      {/* 시안 기준: 채워진 스파클 — var() 팔레트는 /60 같은 불투명도 수식이 무효라 opacity 유틸 사용 */}
      <Sparkles size={26} className="absolute left-1/2 top-24 hidden fill-purple-200 text-purple-200 lg:block" aria-hidden />
      <Sparkles size={20} className="absolute left-6 top-1/2 hidden fill-purple-200 text-purple-200 lg:block" aria-hidden />
      <Sparkles size={22} className="absolute right-5 top-64 hidden fill-orange-300 text-orange-300 opacity-60 lg:block" aria-hidden />
      <div className="relative m-auto flex max-w-container flex-col items-start gap-8 px-5 py-8 lg:flex-row lg:gap-16 lg:px-8 lg:py-12">
        <ProductGallery title={data.title} images={galleryImages} />
        <div className="w-full rounded-3xl bg-card p-6 shadow-[0_12px_32px_rgba(169,79,192,0.12)] lg:w-1/2 lg:p-7">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-[2px] text-orange-500">OFFICIAL MD</span>
            <ShareButton
              iconSize={16}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600"
            />
          </div>
          <div className="mt-4">
            <Badge item={{ ...data, recent_review_count: recentReviewCount }} averageRating={rating} shape="pill" />
          </div>
          <h2 className="mt-3 break-all text-2xl font-bold lg:text-[1.75rem]">{data.title}</h2>
          <div className="mt-2.5 flex items-center gap-1.5 text-[13px]">
            <Star size={14} className="text-warning fill-warning" />
            <span className="font-bold">{rating}</span>
            <span className="text-gray-400">·</span>
            <button
              type="button"
              onClick={onClickReview}
              className="text-gray-500 underline transition-colors hover:text-purple-500"
            >
              리뷰 {reviewCount}개
            </button>
          </div>
          <div className="mt-6">
            {(data.discount_rate ?? 0) > 0 && (
              <s className="text-[15px] text-gray-400">{formatPrice(data.price)}원</s>
            )}
            <div className="flex items-center gap-2.5 text-[1.625rem] font-bold lg:text-[1.75rem]">
              {(data.discount_rate ?? 0) > 0 && <span className="text-orange-500">{data.discount_rate}%</span>}
              <span>{formatPrice(price)}원</span>
            </div>
            {tier !== "free" ? (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <MembershipBadge tier={tier} size="sm" />
                <span className="text-lg font-bold text-purple-500 dark:text-purple-300">
                  {formatPrice(memberPrice)}원
                </span>
                <span className="text-xs text-gray-400">
                  멤버십 상시 {Math.round(MEMBERSHIP_DISCOUNT_RATES[tier] * 100)}% 할인가
                </span>
              </div>
            ) : (
              <Link
                href="/mypage/membership"
                className="group mt-2.5 flex items-center justify-between gap-2 rounded-xl bg-purple-50 px-3.5 py-2.5 text-[13px] transition-colors hover:bg-purple-100"
              >
                <span className="text-gray-600">
                  <b className="text-purple-500 dark:text-purple-300">DIVE+ 가입 시 {formatPrice(plusPrice)}원</b> ·
                  굿즈샵 상시 5% 할인
                </span>
                <span className="flex shrink-0 items-center gap-0.5 font-semibold text-purple-500 dark:text-purple-300">
                  월 1,900원
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            )}
          </div>
          <ul className="mt-6 flex flex-col gap-2.5 text-[13px]">
            <li className="flex items-center gap-2">
              <Truck size={16} className="text-purple-400" aria-hidden />
              <span className="font-semibold">
                {[data.shipping_type, data.delivery_info].filter(Boolean).join(" · ")}
              </span>
            </li>
            {(data.size || data.color) && (
              <li className="flex items-center gap-2">
                <Package size={16} className="text-purple-400" aria-hidden />
                <span className="uppercase text-gray-500">
                  {[data.size, data.color && `${data.color} 컬러`].filter(Boolean).join(" · ")}
                </span>
              </li>
            )}
          </ul>
          <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-5">
            <div className="flex items-center rounded-full border border-gray-300">
              <Button
                variant="plain"
                size="auto"
                onClick={handleDecrease}
                disabled={count === 1}
                className="flex h-9 w-9 items-center justify-center text-gray-400 disabled:opacity-40 lg:h-10 lg:w-10"
                aria-label="수량 감소"
              >
                <Minus size={14} />
              </Button>
              <span className="w-8 text-center text-[15px] font-bold">{count}</span>
              <Button
                variant="plain"
                size="auto"
                onClick={handleIncrease}
                className="flex h-9 w-9 items-center justify-center lg:h-10 lg:w-10"
                aria-label="수량 증가"
              >
                <Plus size={14} />
              </Button>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-xs text-gray-500">총 상품금액</span>
              <strong className="text-2xl font-bold">{formatPrice(totalPrice)}원</strong>
            </div>
          </div>
          <div className="mt-6">
            <ProductActions product={data} quantity={count} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
