import { BADGE_TYPES } from "./constants";
import type { ShopListItem } from "@/types";

export type BadgeFields = Pick<GoodsIncludeRating, "shipping_type" | "review_count" | "rating" | "id">;

interface GoodsIncludeRating extends ShopListItem {
  rating?: number;
}

export const calculateBadge = ({ shipping_type, review_count, rating }: BadgeFields) => {
  const badges: string[] = [];

  if (shipping_type === "무료배송") badges.push(BADGE_TYPES.FREE_DELIVERY);

  const hasEnoughReviews = typeof review_count === "number" && review_count >= 10;
  const hasHighRating = typeof rating === "number" && rating >= 4;

  if (hasEnoughReviews && hasHighRating) badges.push(BADGE_TYPES.HOT);

  //TODO: 신상품(NEW) 뱃지 — 발매일/등록일 기준 부여 로직 추가 예정 (BADGE_TYPES.NEW)

  return badges;
};
