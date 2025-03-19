"use client";
import { usePayment } from "@/hooks/queries/usePayment";
import { useOrderItemsByOrderId } from "@/hooks/queries/useOrderItems";
import Error from "@/components/common/error/Error";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { cartState, sessionState } from "@/store";
import { useShippingAddress } from "@/hooks/queries/useShippingAddress";
import { useQueryClient } from "@tanstack/react-query";
import PaymentSuccessLoading from "@/components/common/loading/PaymentSuccessLoading";
import { getPaymentByOrderId } from "@/lib/supabase/payment";
import { useSearchParams } from "next/navigation";
import {
  confirmTossPayment,
  savePaymentData,
  cartListItemsToOrderItems,
  createPaymentData,
} from "@/lib/api/payment";
import PaymentSuccessView from "./PaymentSuccessView";

const PaymentSuccess = () => {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const session = useRecoilValue(sessionState);
  const [cartItems, setCartItems] = useRecoilState(cartState);
  const [isDataSaved, setIsDataSaved] = useState(false);

  const orderId = searchParams.get("orderId") as string;
  const paymentKey = searchParams.get("paymentKey");
  const amount = searchParams.get("amount");
  const orderName = searchParams.get("orderName");

  const { data: address } = useShippingAddress(session?.user.id);

  // 결제 정보 조회 훅
  const {
    data: payment,
    isLoading: paymentLoading,
    error: paymentError,
  } = usePayment(orderId);

  // 주문 상품 조회 훅
  const {
    data: orderItems,
    isLoading: itemsLoading,
    error: itemsError,
  } = useOrderItemsByOrderId(isDataSaved ? orderId : undefined);

  // 결제 완료 후 orderItems 데이터 갱신
  useEffect(() => {
    if (payment) {
      queryClient.invalidateQueries({ queryKey: ["orderItems", orderId] });
    }
  }, [payment, orderId, queryClient]);

  useEffect(() => {
    if (
      !orderId ||
      !paymentKey ||
      !amount ||
      !address ||
      !session ||
      !cartItems ||
      payment ||
      isDataSaved
    )
      return;

    const processPayment = async () => {
      try {
        //장바구니 결제 성공
        const checkoutItems = JSON.parse(
          localStorage.getItem("checkout_items") || "[]"
        );

        //이미 처리된 결제인지 확인
        const existingPayment = await getPaymentByOrderId(orderId);
        if (existingPayment) {
          await queryClient.invalidateQueries({
            queryKey: ["payment", orderId],
          });
          return;
        }

        //TOSS API 불러오기
        const paymentInfo = await confirmTossPayment(
          paymentKey,
          orderId,
          Number(amount)
        );

        if (paymentInfo.status !== "DONE") {
          // 실패시 fail 페이지로 리다이렉트
          window.location.href = `/payment/fail?message=${encodeURIComponent(
            paymentInfo.message || "결제 처리 중 오류가 발생했습니다."
          )}`;
          return;
        }

        //결제 데이터 생성
        const paymentData = createPaymentData(
          paymentInfo,
          session.user.id,
          orderId,
          amount,
          orderName,
          address
        );

        //주문 상품 데이터
        const orderItemsData = cartListItemsToOrderItems(
          cartItems,
          checkoutItems,
          session.user.id,
          orderId
        );

        //데이터 저장
        await savePaymentData(paymentData, orderItemsData);

        // 데이터 갱신
        await queryClient.invalidateQueries({ queryKey: ["payment", orderId] });
        await queryClient.invalidateQueries({
          queryKey: ["orderItems", orderId],
        });

        //결제한 장바구니 데이터 비우기
        const updatedCart = cartItems.filter(
          (item) => !checkoutItems.includes(item.id)
        );
        localStorage.setItem("shopping_cart", JSON.stringify(updatedCart));
        setCartItems(updatedCart);

        localStorage.removeItem("checkout_items");
        setIsDataSaved(true);
      } catch (error) {
        console.error("데이터 저장 중 오류가 발생했습니다.", error);
      }
    };

    processPayment();
  }, [
    orderId,
    paymentKey,
    amount,
    address,
    session,
    cartItems,
    queryClient,
    orderName,
    payment,
    setCartItems,
    isDataSaved,
  ]);

  if (paymentLoading || itemsLoading || !payment) {
    return <PaymentSuccessLoading />;
  }

  //에러 처리시 장바구니에 담긴 내용 유지 로직 추가해야함.
  if (paymentError || itemsError) {
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
