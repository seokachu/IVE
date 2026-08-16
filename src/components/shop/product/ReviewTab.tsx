import PaginationControl from "@/components/common/PaginationControl";
import ReviewItem from "./ReviewItem";
import { useAverageRating, useReviewCount, useReviews } from "@/hooks/queries/useReviews";
import Error from "@/components/common/error/Error";
import RenderStars from "@/utils/RenderStars";
import { useRef, useState } from "react";
import { PAGINATION } from "@/utils/constants";
import ReviewTabSkeleton from "@/components/common/loading/ReviewTabSkeleton";
import { Info, Star } from "lucide-react";
import type { ShopMenuProps } from "@/types/shop";

const RATING_LEVELS = [5, 4, 3, 2, 1] as const;

const ReviewTab = ({ id }: ShopMenuProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, isError } = useReviews({ id, page: currentPage });
  const { data: allReviews } = useReviewCount(id);
  const { data: averageRating } = useAverageRating(id);

  if (isLoading) return <ReviewTabSkeleton />;
  if (isError) return <Error />;

  const reviews = data?.reviews || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / PAGINATION.REVIEW.ITEMS_PER_PAGE);
  const rating = averageRating ?? 0;

  //별점 분포 — 페이지와 무관하게 전체 리뷰 기준
  const distribution = RATING_LEVELS.map((level) => ({
    level,
    count: (allReviews ?? []).filter((review) => review.rating === level).length,
  }));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    reviewsRef.current?.scrollIntoView();
  };

  //시안 기준: 리뷰 0개 빈 상태 — 파스텔 별 서클 + 안내 힌트 필
  if (totalCount === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-center lg:py-20">
        <span aria-hidden className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-purple-50">
          <Star size={30} className="fill-purple-300 text-purple-300" />
        </span>
        <p className="mt-5 text-lg font-bold">아직 리뷰가 없어요</p>
        <p className="mt-1.5 text-[13px] text-gray-500">이 상품의 첫 번째 리뷰를 남겨보세요!</p>
        <p className="mt-5 flex items-center gap-1.5 rounded-full bg-gray-50 px-4 py-2 text-xs text-gray-400">
          <Info size={13} aria-hidden />
          구매 후 마이페이지 &gt; 주문/배송에서 작성할 수 있어요
        </p>
      </div>
    );
  }

  return (
    //scroll-mt: 페이지 이동 시 스티키 탭바에 요약 카드가 가려지지 않게 여백 확보
    <div ref={reviewsRef} className="m-auto max-w-[960px] scroll-mt-24">
      {/* 시안 기준: 평균 별점 + 분포 게이지 요약 카드 */}
      <div className="flex flex-col items-center gap-6 rounded-3xl bg-gray-50 px-8 py-8 lg:flex-row lg:gap-12 lg:px-10">
        <div className="flex w-[200px] shrink-0 flex-col items-center gap-2">
          <strong className="text-5xl font-bold">{rating}</strong>
          <div className="flex gap-0.5">
            <RenderStars rating={Math.round(rating)} size={18} />
          </div>
          <span className="text-[13px] text-gray-500">리뷰 {totalCount}개</span>
        </div>
        <ul className="flex w-full flex-1 flex-col gap-2.5">
          {distribution.map(({ level, count }) => (
            <li key={level} className="flex items-center gap-3">
              <span
                className={`w-[30px] shrink-0 text-xs font-semibold ${
                  count > 0 && level === 5 ? "" : "text-gray-400"
                }`}
              >
                {level}점
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                {count > 0 && (
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-400 to-orange-300"
                    style={{ width: `${(count / totalCount) * 100}%` }}
                  />
                )}
              </div>
              <span className="w-5 shrink-0 text-right text-xs text-gray-400">{count}</span>
            </li>
          ))}
        </ul>
      </div>
      <ul className="mt-6">
        {reviews?.map((item) => <ReviewItem key={item.id} item={item} />)}
      </ul>
      {totalPages > 1 && (
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          maxDisplayPages={PAGINATION.REVIEW.MAX_DISPLAY_PAGES}
        />
      )}
    </div>
  );
};

export default ReviewTab;
