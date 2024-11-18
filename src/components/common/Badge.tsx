import type { BadgeItemProps } from "@/types";
import { calculateBadge, getBadgeColor } from "@/utils/calculateBadge";

const Badge = ({ item }: BadgeItemProps) => {
  const badges = calculateBadge(item);
  if (badges.length === 0) return null;

  return (
    <div className="flex items-center gap-1 mt-4 mb-1">
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
