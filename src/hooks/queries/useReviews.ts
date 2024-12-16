import {
  getGoodsReviews,
  getOrderItemReview,
  saveOrderItemReview,
  updateOrderItemReview,
} from "@/lib/supabase/review";
import { ReviewResponse } from "@/types";
import { Database } from "@/types/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type UpdateOrderItemReview =
  Database["public"]["Tables"]["goods_reviews"]["Update"];

interface UseReviewsProps {
  id: string;
  page: number;
}

//리뷰 전체 데이터 불러오기
export const useReviews = ({ id, page }: UseReviewsProps) => {
  return useQuery({
    queryKey: ["reviews", id, page] as const,
    queryFn: async (): Promise<ReviewResponse> => getGoodsReviews(id, page),
    placeholderData: (previousData) => previousData,
  });
};

//단일 리뷰 조회
export const useOrderItemReview = (orderId: string) => {
  return useQuery({
    queryKey: ["review", orderId],
    queryFn: () => {
      return getOrderItemReview(orderId);
    },
    enabled: !!orderId,
  });
};

//리뷰 추가
export const useAddOrderItemReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveOrderItemReview,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["review", variables.order_id],
      });
    },
  });
};

//리뷰 수정
// export const useUpdateOrderItemReview = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: updateOrderItemReview,
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({
//         queryKey: ["review", variables.order_id],
//       });
//     },
//   });
// };
