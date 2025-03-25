import {
  getAverageRating,
  getGoodsReviews,
  getGoodsReviewsCount,
  getOrderItemReview,
  saveOrderItemReview,
  updateOrderItemReview,
} from '@/lib/supabase/review';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ReviewResponse, UseReviewsProps } from '@/types/shop';

//리뷰 전체 데이터 불러오기(카운트)
export const useReviewCount = (id: string) => {
  return useQuery({
    queryKey: ['reviews', 'count', id],
    queryFn: () => getGoodsReviewsCount(id),
  });
};

//리뷰 평균
export const useAverageRating = (id: string) => {
  return useQuery({
    queryKey: ['reviews', 'rating', id],
    queryFn: () => getAverageRating(id),
  });
};

//리뷰 전체 데이터 페이지네이션
export const useReviews = ({ id, page }: UseReviewsProps) => {
  return useQuery({
    queryKey: ['reviews', 'list', id, page] as const,
    queryFn: async (): Promise<ReviewResponse> => getGoodsReviews(id, page),
    placeholderData: (previousData) => previousData,
  });
};

//단일 리뷰 조회
export const useOrderItemReview = (orderId: string, productId: string) => {
  return useQuery({
    queryKey: ['reviews', 'item', orderId, productId],
    queryFn: () => getOrderItemReview(orderId, productId),
    enabled: !!orderId && !!productId,
  });
};

//리뷰 추가
export const useAddOrderItemReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveOrderItemReview,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['reviews'],
      });
    },
  });
};

//리뷰 수정
export const useUpdateOrderItemReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, rating, content }: { id: string; rating: number; content: string }) =>
      updateOrderItemReview(id, { rating, content }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['reviews'],
      });
    },
  });
};
