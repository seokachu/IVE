import type { BadgeFields } from "@/types";

export const calculateBadge = ({
  shipping_type,
  review_count,
  rating,
}: BadgeFields) => {
  const badges: string[] = [];

  if (shipping_type === "무료배송") badges.push("무료배송");
  if (review_count && rating && review_count >= 10 && rating >= 4.5)
    badges.push("Best👍");

  return badges;
};

//badge color 설정
export const getBadgeColor = (badge: string) => {
  switch (badge) {
    case "무료배송":
      return "bg-purple";
    case "Best👍":
      return "bg-orange";
    default:
      return "bg-gray-500";
  }
};
