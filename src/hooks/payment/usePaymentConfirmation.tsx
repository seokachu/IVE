'use client';

import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { sessionState, cartState } from '@/store';
import { useQueryClient } from '@tanstack/react-query';
import { getPaymentByOrderId } from '@/lib/supabase/payment';
import { confirmTossPayment, savePaymentData, cartListItemsToOrderItems, createPaymentData } from '@/lib/api/payment';
import useCartCleanup from './useCartCleanup';
import type { UsePaymentConfirmationProps } from '@/types/payment';
import type { CartItem } from '@/types/cart';

export const usePaymentConfirmation = ({
  orderId,
  paymentKey,
  amount,
  orderName,
  address,
  payment,
}: UsePaymentConfirmationProps) => {
  const queryClient = useQueryClient();
  const session = useRecoilValue(sessionState);
  const allCartItems = useRecoilValue(cartState);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutItemsProcessed, setCheckoutItemsProcessed] = useState<string[]>([]);

  //결제 처리 상태
  const isPaymentProcessed = Boolean(payment);
  const { getCheckoutItems, cleanupCart } = useCartCleanup({
    isPaymentComplete: isPaymentProcessed,
  });

  useEffect(() => {
    if (!orderId || !paymentKey || !amount || !address || !session || isPaymentProcessed || isProcessing) return;

    const processPayment = async () => {
      setIsProcessing(true);

      try {
        //결제 성공 시 장바구니에 있는 결제 정보 불러오기
        const checkoutItems = getCheckoutItems();

        //이미 처리된 결제인지 확인
        const existingPayment = await getPaymentByOrderId(orderId);
        if (existingPayment) {
          await queryClient.invalidateQueries({
            queryKey: ['payment', orderId],
          });
          await queryClient.invalidateQueries({
            queryKey: ['orderItems', orderId],
          });

          //처리된 아이템 저장 (장바구니 정리)
          const completedItemIds = checkoutItems.map((item) => (typeof item === 'string' ? item : item.id));
          setCheckoutItemsProcessed(completedItemIds);
          return;
        }

        //TOSS API 불러오기
        const paymentInfo = await confirmTossPayment(paymentKey, orderId, Number(amount));

        if (paymentInfo.status !== 'DONE') {
          //실패시 fail 페이지로 리다이렉트, Error 상태 저장
          setError(paymentInfo.message || '결제 처리 중 오류가 발생했습니다.');
          window.location.href = `/payment/fail?message=${encodeURIComponent(
            paymentInfo.message || '결제 처리 중 오류가 발생했습니다.'
          )}`;
          return;
        }

        //결제 데이터 생성
        const paymentData = createPaymentData(paymentInfo, session.user.id, orderId, amount, orderName, address);

        //체크아웃 아이템 ID 목록
        const checkoutItemIds = checkoutItems.map((item) => (typeof item === 'string' ? item : item.id));

        //전체 장바구니에서 체크아웃 아이템과 일치하는 항목 필터링
        const filteredCartItems = allCartItems.filter((cartItem) => checkoutItemIds.includes(cartItem.id));

        //직접결제 버튼 처리
        const directCartItems = checkoutItems.filter((item): item is CartItem => typeof item !== 'string');

        //장바구니 아이템과 직접 결제 아이템 결합
        const combinedCartItems = filteredCartItems.length > 0 ? filteredCartItems : directCartItems;

        //주문 상품 데이터 생성 후 저장
        const orderItemsData = cartListItemsToOrderItems(combinedCartItems, checkoutItems, session.user.id, orderId);
        await savePaymentData(paymentData, orderItemsData);

        await queryClient.invalidateQueries({ queryKey: ['payment', orderId] });
        await queryClient.invalidateQueries({
          queryKey: ['orderItems', orderId],
        });

        //결제성공 후 처리된 아이템 저장 (장바구니 정리)
        const completedItemIds = checkoutItemIds;
        setCheckoutItemsProcessed(completedItemIds);
      } catch (error) {
        console.error('결제 처리 중 오류가 발생했습니다.', error);
        const errorMessage = error instanceof Error ? error.message : '결제 처리 중 오류가 발생했습니다.';
        setError(errorMessage);
      } finally {
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [
    orderId,
    paymentKey,
    amount,
    address,
    session,
    isPaymentProcessed,
    isProcessing,
    orderName,
    queryClient,
    getCheckoutItems,
    allCartItems,
  ]);

  //장바구니 담긴 내용(결제 처리 완료 후) 정리
  useEffect(() => {
    if (checkoutItemsProcessed.length === 0) return;

    cleanupCart(checkoutItemsProcessed);
    setCheckoutItemsProcessed([]);
  }, [checkoutItemsProcessed, cleanupCart]);

  return {
    isProcessing,
    isPaymentProcessed,
    error,
  };
};

export default usePaymentConfirmation;
