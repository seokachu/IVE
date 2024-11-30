import ActionButton from "../common/button/ActionButton";
import { loadTossPayments } from "@tosspayments/payment-sdk";

interface PaymentButtonProps {
  amount: number;
  orderName: string;
}

const PaymentButton = ({ amount, orderName }: PaymentButtonProps) => {
  const handlePayment = async () => {
    try {
      const tossPayments = await loadTossPayments(
        process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!
      );

      await tossPayments.requestPayment("카드", {
        amount,
        orderId: `ORDER_${new Date().getTime()}`,
        orderName,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ActionButton
      onClick={handlePayment}
      variant="primary"
      className="block text-center w-full rounded-md py-2 bg-purple text-white"
      disabled={!amount}
    >
      결제하기
    </ActionButton>
  );
};

export default PaymentButton;
