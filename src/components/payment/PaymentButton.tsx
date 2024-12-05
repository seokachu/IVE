import { useRecoilValue } from "recoil";
import ActionButton from "../common/button/ActionButton";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import { agreementsState, sessionState } from "@/store";
import { savePayment } from "@/lib/supabase/payment";
import { formatPrice } from "@/utils/calculateDiscount";
import { toast } from "@/hooks/use-toast";
import type { PaymentButtonProps } from "@/types";
import { useCustomerInfo } from "@/hooks/queries/useCustomerInfo";
import { useShippingAddress } from "@/hooks/queries/useShippingAddress";

const PaymentButton = ({ amount, orderName }: PaymentButtonProps) => {
  const session = useRecoilValue(sessionState);
  const agreements = useRecoilValue(agreementsState);
  const { data: customerInfo } = useCustomerInfo(session?.user.id);
  const { data: address } = useShippingAddress(session?.user.id);

  const handlePayment = async () => {
    //로그인 체크
    if (!session) {
      toast({
        title: "로그인이 필요합니다.",
        description: "로그인 후 결제할 수 있습니다.",
      });
      return;
    }

    //결제할 금액이 없을때
    if (amount === 0) {
      toast({
        title: "결제할 내용이 없습니다.",
        description: "장바구니에 상품이 없습니다.",
      });
      return;
    }

    //약관동의 확인
    if (!agreements.privacy || !agreements.refund) {
      toast({
        title: "약관 동의가 필요합니다",
        description: "필수 약관에 모두 동의해주세요.",
        variant: "destructive",
      });
      return;
    }

    //결제 처리
    try {
      const tossPayments = await loadTossPayments(
        process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!
      );

      const orderId = `ORDER_${crypto.randomUUID()}`;

      await tossPayments.requestPayment("카드", {
        amount,
        orderId: orderId,
        orderName,
        customerName: customerInfo.name,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });

      //결제 성공 데이터 저장
      const paymentData = {
        user_id: session!.user.id,
        order_id: orderId,
        amount,
        order_name: orderName,
        payment_method: "카드",
        status: "pending",
        recipient_name: address?.recipient_name,
        recipient_phone: address?.recipient_phone,
        address_line1: address?.address_line1,
        address_line2: address?.address_line2,
        postal_code: address?.postal_code,
        delivery_status: "배송전",
        created_at: new Date(),
      };

      await savePayment(paymentData);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "결제 요청 중 오류가 발생했습니다.",
          description: error.message,
        });
      }
      console.error(error);
    }
  };

  return (
    <ActionButton
      onClick={handlePayment}
      variant="primary"
      className="flex items-center justify-center text-center w-full rounded-md py-2 bg-purple text-white"
    >
      <strong className="text-xl mr-[2px]">{formatPrice(amount)}</strong>원
      결제하기
    </ActionButton>
  );
};

export default PaymentButton;
