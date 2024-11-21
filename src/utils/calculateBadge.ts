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

//badge color 설정
export const getBadgeColor = (badge: string) => {
  switch (badge) {
    case BADGE_TYPES.FREE_DELIVERY:
      return `bg-purple`;
    case BADGE_TYPES.BEST:
      return `bg-orange`;
    default:
      return `bg-gray-500`;
  }
};
