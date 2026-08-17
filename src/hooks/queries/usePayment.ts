import { getPaymentAmountsByOrderIds, getPaymentByOrderId } from "@/lib/supabase/payment";
import { useQuery } from "@tanstack/react-query";

//주문 id 목록의 결제 금액 맵 { orderId: amount } — 결제 내역 요약 카드용
export const usePaymentAmounts = (orderIds: string[]) => {
  const sortedIds = [...new Set(orderIds)].sort();

  return useQuery({
    queryKey: ["payments", "amounts", sortedIds],
    queryFn: () => getPaymentAmountsByOrderIds(sortedIds),
    enabled: sortedIds.length > 0,
  });
};

export const usePayment = (orderId: string) => {
  return useQuery({
    queryKey: ["payments", orderId],
    queryFn: async () => {
      try {
        const data = await getPaymentByOrderId(orderId);
        if (!data) {
          throw new Error("결제 정보를 찾을 수 없습니다.");
        }
        return data;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`결제 정보를 가져오는데 실패했습니다: ${error.message}`);
        }
        throw error;
      }
    },
    enabled: !!orderId,
    retry: 3, // 실패 시 3번까지 재시도
    retryDelay: 1000, // 재시도 간격 1초
  });
};
