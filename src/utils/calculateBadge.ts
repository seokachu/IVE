import { BADGE_TYPES, GOODS_HOT, GOODS_NEW_DAYS } from "./constants";
import type { ShopListItem } from "@/types";

export type BadgeFields = Pick<
  GoodsIncludeRating,
  "shipping_type" | "rating" | "id" | "created_at" | "recent_review_count"
>;

interface GoodsIncludeRating extends ShopListItem {
  rating?: number;
  /** 최근 GOODS_HOT.WINDOW_DAYS일 안에 달린 리뷰 수 — 목록 조회 시 함께 계산해 내려준다 */
  recent_review_count?: number;
}

const DAY_IN_MS = 24 * 60 * 60 * 1000;

//등록 후 GOODS_NEW_DAYS일 이내면 신상품 — 미래 날짜(예약 등록)도 신상품으로 본다
export const isNewGoods = (createdAt: string | null | undefined, now = Date.now()) => {
  if (!createdAt) return false;

  const registered = new Date(createdAt).getTime();
  if (Number.isNaN(registered)) return false;

  return now - registered <= GOODS_NEW_DAYS * DAY_IN_MS;
};

//HOT 판정에 쓰는 최근 리뷰 수 — 목록(조인 결과)과 상세(리뷰 조회 결과) 양쪽에서 같은 기준을 쓴다
export const countRecentReviews = (
  reviews: { created_at: string | null }[] | null | undefined,
  now = Date.now()
) => {
  if (!reviews) return 0;

  const windowStart = now - GOODS_HOT.WINDOW_DAYS * DAY_IN_MS;
  return reviews.filter((review) => review.created_at && new Date(review.created_at).getTime() >= windowStart).length;
};

//뱃지는 눈에 띄는 순서대로 — NEW > HOT > 무료배송
export const calculateBadge = ({ shipping_type, rating, created_at, recent_review_count }: BadgeFields) => {
  const badges: string[] = [];

  if (isNewGoods(created_at)) badges.push(BADGE_TYPES.NEW);

  const isTrending =
    typeof recent_review_count === "number" && recent_review_count >= GOODS_HOT.MIN_RECENT_REVIEWS;
  const hasHighRating = typeof rating === "number" && rating >= GOODS_HOT.MIN_RATING;

  if (isTrending && hasHighRating) badges.push(BADGE_TYPES.HOT);

  if (shipping_type === BADGE_TYPES.FREE_DELIVERY) badges.push(BADGE_TYPES.FREE_DELIVERY);

  return badges;
};
