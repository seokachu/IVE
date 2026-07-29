import { COLORS } from "@/utils/constants";
import { Star } from "lucide-react";

interface RenderStarsProps {
  rating: number;
  size?: number;
}

const RenderStars = ({ rating, size }: RenderStarsProps) => {
  return Array.from({ length: 5 }).map((_, index) => (
    <span key={index}>
      <Star size={size} color={COLORS.warning} fill={index < rating ? COLORS.warning : "none"} />
    </span>
  ));
};

export default RenderStars;
