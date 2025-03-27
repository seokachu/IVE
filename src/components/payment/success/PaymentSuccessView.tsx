import PaymentOverview from "@/components/mypage/order/PaymentOverview";
import OrderItemsList from "./OrderItemsList";
import PaymentSuccessHeader from "./PaymentSuccessHeader";
import type { PaymentSuccessViewProps } from "@/types/payment";

const PaymentSuccessView = ({ orderItems, payment }: PaymentSuccessViewProps) => {
  return (
    <section className="px-5 pt-14 pb-28 lg:px-8 min-h-screen flex items-center justify-center">
      <div className="max-w-[1320px] w-full m-auto flex flex-col gap-5">
        <PaymentSuccessHeader orderId={payment.order_id} />
        <OrderItemsList orderItems={orderItems} />
        <div className="flex flex-col lg:flex-row gap-6">
          <PaymentOverview title="배송 정보" payment={payment} />
          <PaymentOverview title="결제 정보" payment={payment} />
          <PaymentOverview title="결제 수단" payment={payment} />
        </div>
      </div>
    </section>
  );
};

export default PaymentSuccessView;
