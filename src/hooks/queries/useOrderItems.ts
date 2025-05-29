import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  confirmOrderItem,
  getOrderDetail,
  getOrderItems,
} from "@/lib/supabase/orders";

//결제 전체 주문 목록 가져오기
export const useOrderItems = (userId?: string) => {
  return useQuery({
    queryKey: ["orders", "items", userId],
    queryFn: () => getOrderItems(userId!),
    enabled: !!userId,
    staleTime: Infinity,
  });
};

//결제목록 특정 주문 상품 불러오기
export const useOrderItemsByOrderId = (orderId?: string) => {
  return useQuery({
    queryKey: ["orders", "detail", orderId],
    queryFn: () => getOrderDetail(orderId!),
    enabled: !!orderId,
    staleTime: Infinity,
  });
};

//구매확정
export const useConfirmOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => confirmOrderItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
