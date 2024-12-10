import { useRecoilValue } from "recoil";
import ActionButton from "../common/button/ActionButton";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import { agreementsState, selectedItemState, sessionState } from "@/store";
import { formatPrice } from "@/utils/calculateDiscount";
import { toast } from "@/hooks/use-toast";
import type { PaymentButtonProps } from "@/types";
import { useCustomerInfo } from "@/hooks/queries/useCustomerInfo";
import { randomOrderId } from "@/utils/randomOrderName";

const PaymentButton = ({ amount, orderName }: PaymentButtonProps) => {
  const session = useRecoilValue(sessionState);
  const agreements = useRecoilValue(agreementsState);
  const selectedItems = useRecoilValue(selectedItemState);
  const { data: customerInfo } = useCustomerInfo(session?.user.id);

  const orderId = randomOrderId;

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
      localStorage.setItem("checkout_items", JSON.stringify(selectedItems));

      const tossPayments = await loadTossPayments(
        process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!
      );

      await tossPayments.requestPayment("카드", {
        amount: 1000000,
        orderId: orderId,
        orderName,
        customerName: customerInfo.name,
        successUrl: `${
          window.location.origin
        }/payment/success?orderId=${orderId}&amount=${amount}&orderName=${encodeURIComponent(
          orderName
        )}`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (error) {
      localStorage.removeItem("checkout_items");

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
