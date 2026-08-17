import { BADGE_TYPES, GOODS_NEW_DAYS } from "./constants";
import type { ShopListItem } from "@/types";

export type BadgeFields = Pick<
  GoodsIncludeRating,
  "shipping_type" | "review_count" | "rating" | "id" | "created_at"
>;

interface GoodsIncludeRating extends ShopListItem {
  rating?: number;
}

const DAY_IN_MS = 24 * 60 * 60 * 1000;

//등록 후 GOODS_NEW_DAYS일 이내면 신상품 — 미래 날짜(예약 등록)도 신상품으로 본다
export const isNewGoods = (createdAt: string | null | undefined, now = Date.now()) => {
  if (!createdAt) return false;

  const registered = new Date(createdAt).getTime();
  if (Number.isNaN(registered)) return false;

  return now - registered <= GOODS_NEW_DAYS * DAY_IN_MS;
};

//뱃지는 눈에 띄는 순서대로 — NEW > HOT > 무료배송
export const calculateBadge = ({ shipping_type, review_count, rating, created_at }: BadgeFields) => {
  const badges: string[] = [];

  if (isNewGoods(created_at)) badges.push(BADGE_TYPES.NEW);

  const hasEnoughReviews = typeof review_count === "number" && review_count >= 10;
  const hasHighRating = typeof rating === "number" && rating >= 4;

  if (hasEnoughReviews && hasHighRating) badges.push(BADGE_TYPES.HOT);

  if (shipping_type === BADGE_TYPES.FREE_DELIVERY) badges.push(BADGE_TYPES.FREE_DELIVERY);

  return badges;
};
