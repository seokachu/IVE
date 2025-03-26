'use client';

import { usePayment } from '@/hooks/queries/usePayment';
import { useOrderItemsByOrderId } from '@/hooks/queries/useOrderItems';
import Error from '@/components/common/error/Error';
import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { sessionState } from '@/store';
import { useShippingAddress } from '@/hooks/queries/useShippingAddress';
import { useQueryClient } from '@tanstack/react-query';
import PaymentSuccessLoading from '@/components/common/loading/PaymentSuccessLoading';
import { useSearchParams } from 'next/navigation';
import PaymentSuccessView from './PaymentSuccessView';
import { usePaymentConfirmation } from '@/hooks/payment/usePaymentConfirmation';

const PaymentSuccess = () => {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const session = useRecoilValue(sessionState);

  const orderId = searchParams.get('orderId') as string;
  const paymentKey = searchParams.get('paymentKey');
  const amount = searchParams.get('amount');
  const orderName = searchParams.get('orderName');

  const { data: address } = useShippingAddress(session?.user.id);

  //결제 정보
  const { data: payment, isLoading: paymentLoading, error: paymentError } = usePayment(orderId);

  //결제 처리
  const {
    isProcessing,
    isPaymentProcessed,
    error: paymentProcessError,
  } = usePaymentConfirmation({
    orderId,
    paymentKey,
    amount,
    orderName,
    address,
    payment,
  });

  //주문 상품 조회
  const {
    data: orderItems,
    isLoading: itemsLoading,
    error: itemsError,
  } = useOrderItemsByOrderId(isPaymentProcessed ? orderId : undefined);

  //결제 완료 후 orderItems 데이터 갱신
  useEffect(() => {
    if (payment) {
      queryClient.invalidateQueries({ queryKey: ['orders', 'detail', orderId] });
    }
  }, [payment, orderId, queryClient]);

  if (paymentLoading || itemsLoading || isProcessing || !payment) {
    return <PaymentSuccessLoading />;
  }

  //error check
  if (paymentError || itemsError || paymentProcessError) {
    return (
      <main className="min-h-[60vh]">
        <Error />
      </main>
    );
  }

  return (
    <main>
      <PaymentSuccessView orderItems={orderItems || []} payment={payment} />
    </main>
  );
};

export default PaymentSuccess;
