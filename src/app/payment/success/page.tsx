"use client";
import ActionButton from "@/components/common/button/ActionButton";
import { useSearchParams } from "next/navigation";
import { usePayment } from "@/hooks/queries/usePayment";
import { useOrderItems } from "@/hooks/queries/useOrderItems";
import Error from "@/components/common/error/Error";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { cartState, sessionState } from "@/store";
import { savePayment } from "@/lib/supabase/payment";
import { useShippingAddress } from "@/hooks/queries/useShippingAddress";
import { useQueryClient } from "@tanstack/react-query";
import { saveOrderItems } from "@/lib/supabase/orders";
import { confirmPayment } from "@/lib/api/payment";
import PaymentSuccessLoading from "@/components/common/loading/PaymentSuccessLoading";
import OrderListItems from "@/components/mypage/order/OrderListItems";
import { Tables } from "@/types/supabase";
import PaymentOverview from "@/components/mypage/order/PaymentOverview";
import { toast } from "@/hooks/use-toast";

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const session = useRecoilValue(sessionState);
  const [cartItems] = useRecoilState(cartState);
  const orderId = searchParams.get("orderId") as string;
  const paymentKey = searchParams.get("paymentKey");
  const amount = searchParams.get("amount");
  const orderName = searchParams.get("orderName");

  const { data: address } = useShippingAddress(session?.user.id);
  const {
    data: payment,
    isLoading: paymentLoading,
    error: paymentError,
  } = usePayment(orderId);
  const {
    data: orderItems,
    isLoading: itemsLoading,
    error: itemsError,
  } = useOrderItems(orderId);

  console.log("orderItems", orderItems);

  useEffect(() => {
    if (
      !orderId ||
      !paymentKey ||
      !amount ||
      !address ||
      !session ||
      !cartItems
    )
      return;

    const savePaymentData = async () => {
      try {
        const paymentInfo = await confirmPayment({
          paymentKey,
          orderId,
          amount: Number(amount),
        });

        console.log("최종 결제 승인 데이터:", paymentInfo);

        if (paymentInfo.status !== "DONE") {
          console.error("결제 승인 실패:", paymentInfo);
          return;
        }

        //결제 데이터 저장
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

        //결제 목록 리스트 저장
        const orderItemsData = cartItems.map((item: any) => ({
          user_id: session.user.id,
          order_id: orderId,
          product_id: item.id,
          product_name: item.title,
          product_image: item.thumbnail,
          price: item.price,
          quantity: item.quantity,
          shipping_type: item.shipping_type,
        }));

        await savePayment(paymentData);
        await saveOrderItems(orderItemsData);

        //결제 목록 데이터 저장하고 리스트 불러올때까지 기다리기
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["payment", orderId] }),
          queryClient.invalidateQueries({ queryKey: ["orderItems", orderId] }),
        ]);
      } catch (error) {
        toast({
          title: "데이터를 저장하는데 실패했습니다.",
        });
      }
    };

    savePaymentData();
  }, [orderId, paymentKey, amount, address, session, cartItems, queryClient]);

  // 모든 데이터 로딩 중일 때
  const isLoading = paymentLoading || itemsLoading;
  const hasData = payment && orderItems && orderItems.length > 0;

  if (isLoading || !hasData) {
    return <PaymentSuccessLoading />;
  }

  // 에러 발생 시
  if (paymentError || itemsError || !payment) {
    return (
      <main className="min-h-[60vh]">
        <Error />
      </main>
    );
  }
  console.log(payment);

  return (
    <main>
      <section className="px-5 pt-14 pb-28 lg:px-8 min-h-screen flex items-center justify-center">
        <div className="max-w-[1320px] w-full m-auto flex flex-col gap-5 px-5">
          <div className="flex flex-col gap-4 items-center mb-10">
            <h2 className="font-bold text-xl">주문이 완료되었습니다.</h2>
            <h3 className="text-gray-500">주문번호 : {payment.order_id}</h3>
            <div className="flex gap-3">
              <ActionButton
                variant="default"
                className="px-6 py-2 hover:bg-gray-50 hover:text-primary text-sm"
              >
                주문상세 보기
              </ActionButton>
              <ActionButton variant="primary" className="px-6 py-2 text-sm">
                쇼핑 계속하기
              </ActionButton>
            </div>
          </div>
          <div className="border rounded-lg p-6 mb-8">
            <h2 className="text-xl mb-8 border-b pb-4">
              <strong>
                <span>주문상품 정보</span>
                <span className="inline-block -translate-y-[2px] px-2">|</span>
                <span>총 {orderItems?.length}개</span>
              </strong>
            </h2>
            <ul className="flex flex-col w-full">
              {orderItems?.map((item: Tables<"order_items">) => (
                <OrderListItems key={item.id} item={item} />
              ))}
            </ul>
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
