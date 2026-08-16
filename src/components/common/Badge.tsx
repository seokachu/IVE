import { BADGE_TYPES } from "@/utils/constants";
import { calculateBadge } from "@/utils/calculateBadge";
import type { BadgeFields } from "@/utils/calculateBadge";

export interface BadgeItemProps {
  item: BadgeFields;
  averageRating: number;
  //pill: 상세 구매 카드용 라운드 필 형태 (기본은 목록 카드의 rounded-md)
  shape?: "rounded" | "pill";
}

// badge color 설정 — 디자인 시스템 기준
const getBadgeColor = (badge: string) => {
  switch (badge) {
    case BADGE_TYPES.FREE_DELIVERY:
      return `bg-gray-100 text-gray-600`;
    case BADGE_TYPES.HOT:
      return `bg-orange-500 text-white`;
    case BADGE_TYPES.NEW:
      return `bg-purple text-white`;
    default:
      return `bg-gray-500 text-white`;
  }
};

const Badge = ({ item, averageRating, shape = "rounded" }: BadgeItemProps) => {
  const badges = calculateBadge({ ...item, rating: averageRating });
  if (badges.length === 0) return null;

  return (
    <div className="flex items-center gap-1">
      {badges.map((badge) => (
        <span
          key={badge}
          className={`text-xs px-2 py-1 font-bold ${shape === "pill" ? "rounded-full px-3" : "rounded-md"} ${getBadgeColor(badge)}`}
        >
          {badge}
        </span>
      ))}
    </div>
  );
};

export default Badge;
