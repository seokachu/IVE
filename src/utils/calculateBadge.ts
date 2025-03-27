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

  if (hasEnoughReviews && hasHighRating) badges.push(BADGE_TYPES.BEST);

  return badges;
};
