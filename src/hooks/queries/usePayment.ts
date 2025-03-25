import { getPaymentByOrderId } from '@/lib/supabase/payment';
import { useQuery } from '@tanstack/react-query';

export const usePayment = (orderId: string) => {
  return useQuery({
    queryKey: ['payments', orderId],
    queryFn: async () => {
      try {
        const data = await getPaymentByOrderId(orderId);
        if (!data) {
          throw new Error('결제 정보를 찾을 수 없습니다.');
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
