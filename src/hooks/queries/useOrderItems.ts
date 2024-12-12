import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  confirmOrderItem,
  deleteAllOrderItems,
  deleteOrderItems,
  getOrderDetail,
  getOrderItems,
} from "@/lib/supabase/orders";

//결제 전체 주문 목록 가져오기
export const useOrderItems = (userId?: string) => {
  return useQuery({
    queryKey: ["orderItems", userId],
    queryFn: () => getOrderItems(userId!),
    enabled: !!userId,
    staleTime: Infinity,
  });
};

//결제목록 특정 주문 상품 불러오기
export const useOrderItemsByOrderId = (orderId?: string) => {
  return useQuery({
    queryKey: ["orderItemsByOrder", orderId],
    queryFn: () => getOrderDetail(orderId!),
    enabled: !!orderId,
    staleTime: Infinity,
  });
};

//선택한 결제목록 삭제 mutation
export const useDeleteOrderItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemIds: string[]) => deleteOrderItems(itemIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orderItems"] });
    },
  });
};

//전체삭제 mutation
export const useDeleteAllOrderItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => deleteAllOrderItems(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orderItems"] });
    },
  });
};

//구매확정
export const useConfirmOrder = () => {
  return useMutation({
    mutationFn: async (itemId: string) => {
      const data = await confirmOrderItem(itemId);
      return data;
    },
  });
};
