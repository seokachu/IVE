import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrderItems } from "@/lib/supabase/orders";

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
export const useDeleteOrderItems = (orderId: string[]) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
  });
};

//전체삭제 mutation
export const useDeleteAllOrderItems = (userId: string) => {};
