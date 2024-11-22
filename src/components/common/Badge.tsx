import type { BadgeItemProps } from "@/types";
import { calculateBadge } from "@/utils/calculateBadge";
import { BADGE_TYPES } from "@/utils/constants";

// badge color 설정
const getBadgeColor = (badge: string) => {
  switch (badge) {
    case BADGE_TYPES.FREE_DELIVERY:
      return `bg-purple`;
    case BADGE_TYPES.BEST:
      return `bg-custom-orange`;
    default:
      return `bg-gray-500`;
  }
};

const Badge = ({ item, averageRating }: BadgeItemProps) => {
  const badges = calculateBadge({ ...item, rating: averageRating });
  if (badges.length === 0) return null;

  return (
    <div className="flex items-center gap-1">
      {badges.map((badge) => (
        <span
          key={badge}
          className={`text-xs px-2 py-1 rounded-md text-white ${getBadgeColor(
            badge
          )}`}
        >
          {badge}
        </span>
      ))}
    </div>
  );
};

export default Badge;
