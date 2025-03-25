import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  confirmOrderItem,
  deleteAllOrderItems,
  deleteOrderItems,
  getOrderDetail,
  getOrderItems,
} from '@/lib/supabase/orders';

//결제 전체 주문 목록 가져오기
export const useOrderItems = (userId?: string) => {
  return useQuery({
    queryKey: ['orders', 'items', userId],
    queryFn: () => getOrderItems(userId!),
    enabled: !!userId,
    staleTime: Infinity,
  });
};

//결제목록 특정 주문 상품 불러오기
export const useOrderItemsByOrderId = (orderId?: string) => {
  return useQuery({
    queryKey: ['orders', 'detail', orderId],
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
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

//전체삭제 mutation
export const useDeleteAllOrderItems = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => deleteAllOrderItems(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

//구매확정
export const useConfirmOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => confirmOrderItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
