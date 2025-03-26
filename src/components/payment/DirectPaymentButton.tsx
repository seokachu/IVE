import { loadTossPayments } from "@tosspayments/payment-sdk";
import { sessionState } from "@/store";
import { getDiscountedPrice } from "@/utils/calculateDiscount";
import { toast } from "@/hooks/use-toast";
import { useCustomerInfo } from "@/hooks/queries/useCustomerInfo";
import { randomOrderId } from "@/utils/randomOrderName";
import { useRecoilValue } from "recoil";
import ActionButton from "../common/button/ActionButton";
import { useShippingAddress } from "@/hooks/queries/useShippingAddress";
import useAuthGuard from "@/hooks/useAuthGuard";
import type { DirectPaymentButtonProps } from "@/types/shop";

const DirectPaymentButton = ({ product, quantity }: DirectPaymentButtonProps) => {
  const session = useRecoilValue(sessionState);
  const { data: customerInfo } = useCustomerInfo(session?.user.id);
  const { data: userAddress } = useShippingAddress(session?.user.id);
  const { checkAuth } = useAuthGuard({
    title: "로그인이 필요합니다.",
    description: "로그인 후 결제할 수 있습니다.",
  });

  const handleDirectPayment = async () => {
    //로그인 체크
    if (!checkAuth()) return;

    //주문자 정보, 배송 정보 체크
    const missingInfo = [];
    if (!customerInfo) missingInfo.push("주문자 정보");
    if (!userAddress) missingInfo.push("배송 정보");

    if (missingInfo.length > 0) {
      toast({
        title: `${missingInfo.join("와 ")}가 없습니다.`,
        description: `${missingInfo.join("와 ")}를 입력해 주세요.`,
      });
      return;
    }

    //결제 처리
    try {
      const discountedPrice = getDiscountedPrice(product);
      const amount = discountedPrice * quantity;
      const orderId = randomOrderId;

      // 단일 상품 결제 정보 저장(성공 페이지에 넘겨줘야 함)
      localStorage.setItem("checkout_items", JSON.stringify([{ ...product, quantity }]));

      const tossPayments = await loadTossPayments(process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!);

      await tossPayments.requestPayment("카드", {
        amount,
        orderId,
        orderName: product.title,
        customerName: customerInfo?.name,
        successUrl: `${
          window.location.origin
        }/payment/success?orderId=${orderId}&amount=${amount}&orderName=${encodeURIComponent(product.title)}`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (error) {
      localStorage.removeItem("checkout_items");

      if (error instanceof Error) {
        toast({
          title: "결제 요청 중 오류가 발생했습니다.",
          description: error.message,
          variant: "destructive",
        });
      }
      throw error;
    }
  };

  return (
    <ActionButton onClick={handleDirectPayment} variant="primary" className="w-full py-3 text-center">
      구매하기
    </ActionButton>
  );
};

export default DirectPaymentButton;
