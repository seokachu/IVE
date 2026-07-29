import { COLORS } from "@/utils/constants";
import { FaStar, FaRegStar } from "react-icons/fa";

interface RenderStarsProps {
  rating: number;
  size?: number;
}

const RenderStars = ({ rating, size }: RenderStarsProps) => {
  return Array.from({ length: 5 }).map((_, index) => (
    <span key={index}>
      {index < rating ? <FaStar size={size} color={COLORS.warning} /> : <FaRegStar size={size} color={COLORS.warning} />}
    </span>
  ));
};

export default RenderStars;
