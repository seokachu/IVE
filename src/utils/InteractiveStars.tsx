import { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

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
          {index < (hoverRating || rating) ? (
            <FaStar size={size} color="#FACC15" />
          ) : (
            <FaRegStar size={size} color="#FACC15" />
          )}
        </span>
      ))}
    </div>
  );
};

export default InteractiveStars;
