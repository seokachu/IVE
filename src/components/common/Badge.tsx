import { getAverageRating } from "@/lib/supabase/review";
import type { BadgeItemProps } from "@/types";
import { calculateBadge, getBadgeColor } from "@/utils/calculateBadge";
import { useEffect, useState } from "react";

const Badge = ({ item }: BadgeItemProps) => {
  const [averageRating, setAverageRating] = useState(0);


  useEffect(() => {
    const fetchRating = async () => {
      try {
        const rating = await getAverageRating(item.id);
        setAverageRating(rating);
      } catch (error) {
        if (error instanceof Error) {
          console.log(`평점 조회에 실패했습니다. : ${error.message}`);
        }
      }
    };

    fetchRating();
  }, [item.id]);

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
