import axios from 'axios';
import type { TossPaymentErrorResponse, TossPaymentResponse } from '@/types/payment';

export const confirmTossPayment = async (
  paymentKey: string,
  orderId: string,
  amount: number
): Promise<TossPaymentResponse> => {
  try {
    console.log('Sending payment confirmation request', { paymentKey, orderId, amount });
    const { data } = await axios.post('/api/payments/confirm', {
      paymentKey,
      orderId,
      amount,
    });

    console.log('Payment confirmation response:', data);
    return data;
  } catch (error) {
    console.error('Payment confirmation error:', error);

    if (axios.isAxiosError(error) && error.response) {
      return {
        ...(error.response.data as TossPaymentErrorResponse),
        message: error.response.data.message || '결제 처리 중 오류가 발생했습니다.',
      };
    }
    throw new Error(error instanceof Error ? error.message : '결제 처리 중 오류가 발생했습니다.');
  }
};
