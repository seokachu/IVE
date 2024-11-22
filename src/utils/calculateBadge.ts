import type { BadgeFields } from "@/types";
import { BADGE_TYPES } from "./constants";

export const calculateBadge = ({
  shipping_type,
  review_count,
  rating,
}: BadgeFields) => {
  const badges: string[] = [];

  if (shipping_type === "무료배송") badges.push(BADGE_TYPES.FREE_DELIVERY);
  const hasEnoughReviews = review_count && review_count >= 10;
  const hasHighRating = rating && rating >= 4.5;

  if (hasEnoughReviews && hasHighRating) badges.push(BADGE_TYPES.BEST);

  return badges;
};
