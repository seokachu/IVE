import { useQuery } from "@tanstack/react-query";
import { getOrderItems } from "@/lib/supabase/orders";

export const useOrderItems = (orderId: string) => {
  return useQuery({
    queryKey: ["orderItems", orderId],
    queryFn: () => getOrderItems(orderId),
    enabled: !!orderId,
    staleTime: Infinity,
  });
};
