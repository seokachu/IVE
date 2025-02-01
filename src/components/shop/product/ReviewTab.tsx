import PaginationControl from "@/components/common/PaginationControl";
import ReviewItem from "./ReviewItem";
import type { ShopMenuProps } from "@/types";
import { useReviews } from "@/hooks/queries/useReviews";
import Error from "@/components/common/error/Error";
import RenderStars from "@/utils/RenderStars";
import { useRef, useState } from "react";
import { PAGINATION } from "@/utils/constants";
import ReviewTabSkeleton from "@/components/common/loading/ReviewTabSkeleton";

const ReviewTab = ({ id }: ShopMenuProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, isError } = useReviews({ id, page: currentPage });

  if (isLoading) return <ReviewTabSkeleton />;
  if (isError) return <Error />;

  const reviews = data?.reviews || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / PAGINATION.ITEMS_PER_PAGE);

  // 평균 별점 계산
  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  // 평균 별점 반올림
  const roundedRating = Math.round(averageRating * 10) / 10;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    reviewsRef.current?.scrollIntoView();
  };

  return (
    <>
      {totalCount > 0 ? (
        <>
          <div
            className="flex justify-center items-center mb-10"
            ref={reviewsRef}
          >
            <div className="flex gap-1 mr-5">
              <RenderStars rating={roundedRating} size={25} />
            </div>
            <div className="flex items-center gap-2">
              <strong className="text-2xl">{roundedRating}</strong>
              <p className="text-dark-gray translate-y-[1px]">/5.0</p>
            </div>
          </div>
          <div>
            <h2 className="lg:text-xl font-bold mb-2">
              리뷰 &#40;{totalCount}&#41;
            </h2>
            <ul>
              {reviews?.map((item) => (
                <ReviewItem key={item.id} item={item} />
              ))}
            </ul>
            {totalPages > 1 && (
              <PaginationControl
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                maxDisplayPages={PAGINATION.MAX_DISPLAY_PAGES}
              />
            )}
          </div>
        </>
      ) : (
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
            <h2 className="lg:text-xl text-center font-bold my-28">
              리뷰가 없습니다.
            </h2>
          </div>
        </>
      )}
    </>
  );
};

export default ReviewTab;
