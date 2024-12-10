"use client";
import { useSearchParams } from "next/navigation";
import { usePayment } from "@/hooks/queries/usePayment";
import { useOrderItems } from "@/hooks/queries/useOrderItems";
import Error from "@/components/common/error/Error";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { cartState, sessionState } from "@/store";
import { useShippingAddress } from "@/hooks/queries/useShippingAddress";
import { useQueryClient } from "@tanstack/react-query";
import PaymentSuccessLoading from "@/components/common/loading/PaymentSuccessLoading";
import OrderListItems from "@/components/mypage/order/OrderListItems";
import { Tables } from "@/types/supabase";
import PaymentOverview from "@/components/mypage/order/PaymentOverview";
import PaymentSuccessHeader from "@/components/payment/success/PaymentSuccessHeader";
import { saveOrderItems } from "@/lib/supabase/orders";
import { getPaymentByOrderId, savePayment } from "@/lib/supabase/payment";

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const session = useRecoilValue(sessionState);
  const [cartItems, setCartItems] = useRecoilState(cartState);

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
  } = useOrderItems(orderId);

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
      payment // 이미 결제 데이터가 있으면 저장하지 않음
    )
      return;

    const savePaymentData = async () => {
      try {
        const checkoutItems = JSON.parse(
          localStorage.getItem("checkout_items") || "[]"
        );

        // checkout_items를 기반으로 선택된 상품 필터링
        const selectedCartItems = cartItems.filter((item) =>
          checkoutItems.includes(item.id)
        );

        const existingPayment = await getPaymentByOrderId(orderId);
        if (existingPayment) {
          await queryClient.invalidateQueries({
            queryKey: ["payment", orderId],
          });
          return;
        }

        const response = await fetch(
          `https://api.tosspayments.com/v1/payments/confirm`,
          {
            method: "POST",
            headers: {
              Authorization: `Basic ${btoa(
                `${process.env.NEXT_PUBLIC_TOSS_SECRET_KEY}:`
              )}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              paymentKey,
              orderId,
              amount: Number(amount),
            }),
          }
        );

        const paymentInfo = await response.json();

        if (!response.ok || paymentInfo.status !== "DONE") {
          // 실패시 fail 페이지로 리다이렉트
          window.location.href = `/payment/fail?message=${encodeURIComponent(
            paymentInfo.message
          )}`;
          return;
        }

        const paymentData = {
          user_id: session.user.id,
          order_id: orderId,
          amount: Number(amount),
          order_name: orderName,
          payment_method: paymentInfo.easyPay
            ? `${paymentInfo.easyPay.provider} 간편결제`
            : paymentInfo.method || "카드",
          status: "결제 완료",
          installment_months: paymentInfo.card?.installmentPlanMonths || 0,
          recipient_name: address.recipient_name,
          recipient_phone: address.recipient_phone,
          address_line1: address.address_line1,
          address_line2: address.address_line2,
          postal_code: address.postal_code,
          delivery_status: "배송전",
          created_at: paymentInfo.approvedAt,
        };

        const orderItemsData = selectedCartItems.map((item) => ({
          user_id: session.user.id,
          order_id: orderId,
          product_id: item.id,
          product_name: item.title,
          product_image: item.thumbnail,
          price: item.price,
          quantity: item.quantity,
          shipping_type: item.shipping_type ?? "일반배송",
          discount_rate: item.discount_rate ?? 0,
        }));

        // 순차적으로 저장
        await savePayment(paymentData);
        await saveOrderItems(orderItemsData);

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
      } catch (error) {
        console.log("데이터 저장 중 오류가 발생했습니다.", error);
      }
    };

    savePaymentData();
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
  ]);

  if (paymentLoading || itemsLoading || !payment) {
    return <PaymentSuccessLoading />;
  }

  if (paymentError || itemsError) {
    return (
      <main className="min-h-[60vh]">
        <Error />
      </main>
    );
  }

  return (
    <main>
      <section className="px-5 pt-14 pb-28 lg:px-8 min-h-screen flex items-center justify-center">
        <div className="max-w-[1320px] w-full m-auto flex flex-col gap-5 px-5">
          <PaymentSuccessHeader order_id={payment.order_id} />
          <div className="border rounded-lg p-6 mb-8">
            <h2 className="text-xl mb-8 border-b pb-4">
              <strong>
                <span>주문상품 정보</span>
                <span className="inline-block -translate-y-[2px] px-2">|</span>
                <span>총 {orderItems?.length}개</span>
              </strong>
            </h2>
            {orderItems && orderItems.length > 0 && (
              <ul className="flex flex-col w-full">
                {orderItems.map((item: Tables<"order_items">) => (
                  <OrderListItems key={item.id} item={item} />
                ))}
              </ul>
            )}
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            <PaymentOverview title="배송 정보" payment={payment} />
            <PaymentOverview title="결제 정보" payment={payment} />
            <PaymentOverview title="결제 수단" payment={payment} />
          </div>
        </div>
      </section>
    </main>
  );
};

export default PaymentSuccessPage;
