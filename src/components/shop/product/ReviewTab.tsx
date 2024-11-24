import { FaRegStar } from "react-icons/fa";
import PaginationControl from "@/components/common/PaginationControl";
import ReviewItems from "./ReviewItems";
import type { ShopMenuProps } from "@/types";
import { useReviews } from "@/hooks/queries/useReviews";
import Error from "@/components/common/error/Error";
import ReviewSkeleton from "@/components/common/loading/ReviewSkeleton";

const ReviewTab = ({ id }: ShopMenuProps) => {
  const { data, isLoading, isError } = useReviews(id);

  if (isLoading) return <ReviewSkeleton />;
  if (isError) return <Error />;

  const reviewCount = data?.length;

  return (
    <>
      <div className="flex justify-center items-center mb-10">
        <div className="flex gap-1 mr-5">
          <FaRegStar size={25} />
          <FaRegStar size={25} />
          <FaRegStar size={25} />
          <FaRegStar size={25} />
          <FaRegStar size={25} />
        </div>
        <div className="flex items-center gap-2">
          <strong className="text-2xl">5.0</strong>
          <p className="text-dark-gray translate-y-[1px]">/5.0</p>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">리뷰 &#40;{reviewCount}&#41;</h2>
        <ul>
          {data?.map((item) => (
            <ReviewItems key={item.id} item={item} />
          ))}
        </ul>
        <PaginationControl />
      </div>
    </>
  );
};

export default ReviewTab;
