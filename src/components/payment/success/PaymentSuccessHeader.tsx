import ActionButton from "@/components/common/button/ActionButton";
import { useRouter } from "next/navigation";

interface PaymentSuccessHeaderProps {
  order_id: string;
}

const PaymentSuccessHeader = ({ order_id }: PaymentSuccessHeaderProps) => {
  const { push } = useRouter();

  const onClickGoOrders = () => {
    push("/mypage/orders");
  };

  const onClickGoCart = () => {
    push("/shop");
  };

  return (
    <div className="flex flex-col gap-4 items-center mb-10">
      <h2 className="font-bold text-lg lg:text-xl">주문이 완료되었습니다.</h2>
      <h3 className="text-gray-500">주문번호 : {order_id}</h3>
      <div className="flex gap-3">
        <ActionButton
          onClick={onClickGoOrders}
          variant="default"
          className="px-6 py-2 hover:bg-gray-50 hover:text-primary text-sm"
        >
          주문상세 보기
        </ActionButton>
        <ActionButton
          onClick={onClickGoCart}
          variant="primary"
          className="px-6 py-2 text-sm"
        >
          쇼핑 계속하기
        </ActionButton>
      </div>
    </div>
  );
};

export default PaymentSuccessHeader;
