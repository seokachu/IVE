import { confirmPayment } from "@/lib/api/payment";
import { saveOrderItems } from "@/lib/supabase/orders";
import { getPaymentByOrderId, savePayment } from "@/lib/supabase/payment";
import { toast } from "./use-toast";
import { Session } from "@supabase/supabase-js";
import { QueryClient } from "@tanstack/react-query";
import type { Address, CartItem } from "@/types";

interface PaymentProcessParams {
  orderId: string;
  paymentKey: string | null;
  amount: string | null;
  orderName: string | null;
  session: Session | null;
  address: Address;
  cartItems: CartItem[];
  queryClient: QueryClient;
}

const usePaymentProcess = ({
  orderId,
  paymentKey,
  amount,
  orderName,
  session,
  address,
  cartItems,
  queryClient,
}: PaymentProcessParams) => {
  const processPayment = async () => {
    if (
      !orderId ||
      !paymentKey ||
      !amount ||
      !address ||
      !session ||
      !cartItems
    )
      return;
    try {
      // 이미 처리된 결제인지 확인
      const existingPayment = await getPaymentByOrderId(orderId);
      if (existingPayment) return;

      console.log("Existing payment:", existingPayment);
      // const paymentInfo = await confirmPayment({
      //   paymentKey,
      //   orderId,
      //   amount: Number(amount),
      // });
      const response = await fetch(
        `https://api.tosspayments.com/v1/payments/confirm`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${process.env.NEXT_PUBLIC_TOSS_SECRET_KEY}:`
            ).toString("base64")}`,
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
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "결제 처리 중 오류가 발생했습니다.";
      toast({ title: errorMessage });
    }
  };

  return { processPayment };
};

export default usePaymentProcess;
