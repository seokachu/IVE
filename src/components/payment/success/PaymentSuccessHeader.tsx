import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Check, Copy } from "lucide-react";
import CheckoutSteps from "@/components/cart/CheckoutSteps";
import { toast } from "@/hooks/use-toast";
import type { PaymentSuccessHeaderProps } from "@/types/payment";

const PaymentSuccessHeader = ({ orderId }: PaymentSuccessHeaderProps) => {
  const { push } = useRouter();

  const onClickGoOrders = () => {
    push("/mypage/orders");
  };

  const onClickGoCart = () => {
    push("/shop");
  };

  //주문번호 복사
  const onClickCopyOrderId = async () => {
    if (!orderId) return;
    try {
      await navigator.clipboard.writeText(orderId);
      toast({
        title: "주문번호를 복사했어요.",
      });
    } catch {
      toast({
        title: "주문번호 복사에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center">
      <CheckoutSteps current={3} />
      <span
        className="mt-9 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-gradient-to-r from-purple-400 to-orange-300"
        aria-hidden
      >
        <Check size={34} strokeWidth={3} className="text-white" />
      </span>
      <h2 className="mt-5 text-2xl font-bold lg:text-[28px]">주문이 완료되었어요!</h2>
      <p className="mt-2.5 text-[15px] text-gray-500">주문하신 굿즈를 정성껏 포장해서 보내드릴게요</p>
      <Button
        variant="plain"
        size="auto"
        onClick={onClickCopyOrderId}
        className="mt-4 flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-[13px] hover:bg-gray-200"
        aria-label="주문번호 복사"
      >
        <span className="text-gray-400">주문번호</span>
        <strong className="font-semibold">{orderId}</strong>
        <Copy size={13} className="text-gray-400" />
      </Button>
      <div className="mt-6 flex gap-2.5">
        <Button
          onClick={onClickGoOrders}
          variant="plain"
          size="auto"
          className="h-12 rounded-full border border-gray-300 px-7 text-sm font-semibold text-gray-500 hover:bg-gray-50"
        >
          주문상세 보기
        </Button>
        <Button
          onClick={onClickGoCart}
          variant="plain"
          size="auto"
          className="h-12 rounded-full bg-purple-300 px-7 text-sm font-bold text-white transition-colors hover:bg-purple-400"
        >
          쇼핑 계속하기
        </Button>
      </div>
    </div>
  );
};

export default PaymentSuccessHeader;
