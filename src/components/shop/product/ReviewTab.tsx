import PaginationControl from "@/components/common/PaginationControl";
import ReviewItems from "./ReviewItems";
import type { ShopMenuProps } from "@/types";
import { useReviews } from "@/hooks/queries/useReviews";
import Error from "@/components/common/error/Error";
import ReviewSkeleton from "@/components/common/loading/ReviewSkeleton";
import RenderStars from "@/utils/RenderStars";

const ReviewTab = ({ id }: ShopMenuProps) => {
  const { data, isLoading, isError } = useReviews(id);

  if (isLoading) return <ReviewSkeleton />;
  if (isError) return <Error />;

  const reviewCount = data?.length;

  // 평균 별점 계산
  const averageRating = data?.length
    ? data.reduce((sum, review) => sum + review.rating, 0) / data.length
    : 0;

  // 평균 별점 반올림
  const roundedRating = Math.round(averageRating * 10) / 10;

  return (
    <>
      {reviewCount ? (
        <>
          <div className="flex justify-center items-center mb-10">
            <div className="flex gap-1 mr-5">
              <RenderStars rating={roundedRating} size={25} />
            </div>
            <div className="flex items-center gap-2">
              <strong className="text-2xl">{roundedRating}</strong>
              <p className="text-dark-gray translate-y-[1px]">/5.0</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">
              리뷰 &#40;{reviewCount}&#41;
            </h2>
            <ul>
              {data?.map((item) => (
                <ReviewItems key={item.id} item={item} />
              ))}
            </ul>
            <PaginationControl />
          </div>
        </>
      ) : (
        <h2 className="text-xl text-center font-bold">리뷰가 없습니다.</h2>
      )}
    </>
  );
};

export default ReviewTab;
