import { FaStar, FaRegStar } from "react-icons/fa";

interface RenderStarsProps {
  rating: number;
  size?: number;
}

const RenderStars = ({ rating, size }: RenderStarsProps) => {
  return Array.from({ length: 5 }).map((_, index) => (
    <span key={index}>
      {index < rating ? (
        <FaStar size={size} className="text-yellow-400" />
      ) : (
        <FaRegStar size={size} className="text-yellow-400" />
      )}
    </span>
  ));
};

export default RenderStars;
