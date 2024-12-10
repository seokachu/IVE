import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteAllOrderItems,
  deleteOrderItems,
  getOrderItems,
} from "@/lib/supabase/orders";

//결제목록 가져오기
export const useOrderItems = (orderId: string) => {
  return useQuery({
    queryKey: ["orderItems", orderId],
    queryFn: () => getOrderItems(orderId),
    enabled: !!orderId,
    staleTime: Infinity,
  });
};

//선택한 결제목록 삭제 mutation
export const useDeleteOrderItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemsIds: string[]) => deleteOrderItems(itemsIds),
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
