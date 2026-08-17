import PaymentOverview from "@/components/mypage/order/PaymentOverview";
import OrderItemsList from "./OrderItemsList";
import PaymentSuccessHeader from "./PaymentSuccessHeader";
import type { PaymentSuccessViewProps } from "@/types/payment";

const PaymentSuccessView = ({ orderItems, payment }: PaymentSuccessViewProps) => {
  return (
    <section className="px-5 pb-28 pt-12 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-5">
        <PaymentSuccessHeader orderId={payment.order_id} />
        <div className="mt-5">
          <OrderItemsList orderItems={orderItems} />
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          <PaymentOverview title="배송 정보" payment={payment} />
          <PaymentOverview title="결제 정보" payment={payment} />
          <PaymentOverview title="결제 수단" payment={payment} />
        </div>
      </div>
    </section>
  );
};

export default PaymentSuccessView;
