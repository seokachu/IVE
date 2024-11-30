import { useRecoilValue } from "recoil";
import ActionButton from "../common/button/ActionButton";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import { agreementsState, sessionState } from "@/store";
import { savePayment } from "@/lib/supabase/payment";
import { formatPrice } from "@/utils/calculateDiscount";
import { toast } from "@/hooks/use-toast";

interface PaymentButtonProps {
  amount: number;
  orderName: string;
}

const PaymentButton = ({ amount, orderName }: PaymentButtonProps) => {
  const session = useRecoilValue(sessionState);
  const agreements = useRecoilValue(agreementsState);

  const handlePayment = async () => {
    if (!agreements.privacy || !agreements.refund) {
      toast({
        title: "약관 동의가 필요합니다",
        description: "필수 약관에 모두 동의해주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      const tossPayments = await loadTossPayments(
        process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!
      );

      const orderId = `ORDER_${crypto.randomUUID()}`;

      await tossPayments.requestPayment("카드", {
        amount,
        orderId: orderId,
        orderName,
        customerName: session?.user.user_metadata?.name,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });

      //결제 성공 데이터 저장
      const paymentData = {
        user_id: session?.user.id!,
        order_id: orderId,
        amount,
        order_name: orderName,
        payment_method: "카드",
        status: "pending",
        recipient_name: "받는사람 이름",
        recipient_phone: "010-0000-0000",
        address_line1: "주소",
        address_line2: "상세주소",
        postal_code: "03139",
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
      disabled={!amount || !session}
    >
      <strong className="text-xl mr-[2px]">{formatPrice(amount)}</strong>원
      결제하기
    </ActionButton>
  );
};

export default PaymentButton;
