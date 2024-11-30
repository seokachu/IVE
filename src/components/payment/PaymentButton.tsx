import { useRecoilValue } from "recoil";
import ActionButton from "../common/button/ActionButton";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import { sessionState } from "@/store";
import { getPayments, savePayment } from "@/lib/supabase/payment";
import { formatPrice } from "@/utils/calculateDiscount";

interface PaymentButtonProps {
  amount: number;
  orderName: string;
}

const PaymentButton = ({ amount, orderName }: PaymentButtonProps) => {
  const session = useRecoilValue(sessionState);

  const handlePayment = async () => {
    try {
      const tossPayments = await loadTossPayments(
        process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!
      );

      const response = await tossPayments.requestPayment("카드", {
        amount,
        orderId: `ORDER_${new Date().getTime()}`,
        orderName,
        customerName: session?.user.user_metadata?.name,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });

      //결제 성공 데이터 저장
      const paymentData = {
        user_id: session?.user.id!,
        order_id: `ORDER_${new Date().getTime()}`,
        amount,
        order_name: orderName,
        payment_method: "카드",
        status: "성공",
      };

      await savePayment(paymentData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ActionButton
      onClick={handlePayment}
      variant="primary"
      className="flex items-center justify-center text-center w-full rounded-md py-2 bg-purple text-white"
      disabled={!amount}
    >
      <strong className="text-xl mr-[2px]">{formatPrice(amount)}</strong>원
      결제하기
    </ActionButton>
  );
};

export default PaymentButton;
