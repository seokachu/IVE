import { COLORS } from "@/utils/constants";
import { useState } from "react";
import { Star } from "lucide-react";

interface InteractiveStarProps {
  rating: number;
  size?: number;
  onChange: (rating: number) => void;
}

const InteractiveStars = ({ rating, size = 24, onChange }: InteractiveStarProps) => {
  const [hoverRating, setHoverRating] = useState(0);
  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={index}
          onMouseEnter={() => setHoverRating(index + 1)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => onChange(index + 1)}
          className="cursor-pointer"
        >
          <Star size={size} color={COLORS.warning} fill={index < (hoverRating || rating) ? COLORS.warning : "none"} />
        </span>
      ))}
    </div>
  );
};

export default InteractiveStars;
