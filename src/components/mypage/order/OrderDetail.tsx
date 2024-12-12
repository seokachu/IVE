import ActionButton from "@/components/common/button/ActionButton";
import { FaArrowLeft } from "react-icons/fa";
import DetailOrderItem from "./DetailOrderItem";
import { formatDate } from "@/utils/formatDate";
import OrderCustomerInfoItem from "@/components/cart/OrderCustomerInfoItem";
import { useRecoilValue } from "recoil";
import { useCustomerInfo } from "@/hooks/queries/useCustomerInfo";
import { sessionState } from "@/store";
import { usePayment } from "@/hooks/queries/usePayment";
import PaymentOverview from "./PaymentOverview";
import type { OrderDetailProps } from "@/types";

const OrderDetail = ({ orderItems, onBack }: OrderDetailProps) => {
  const session = useRecoilValue(sessionState);
  const { data: customerInfo } = useCustomerInfo(session?.user.id);
  const { data: payment } = usePayment(orderItems[0].order_id);

  return (
    <div>
      <h2 className="font-bold lg:text-xl hidden lg:block">주문 상세 내역</h2>
      <div className="flex items-center my-5">
        <ActionButton
          onClick={onBack}
          variant="default"
          className="flex items-center gap-1 border-0 text-gray-500"
        >
          <FaArrowLeft className="translate-y-[1px]" />
          돌아가기
        </ActionButton>
      </div>
      <div className="flex justify-between border-b text-xs lg:text-sm">
        <time>{formatDate(orderItems[0].created_at)}</time>
        <h3 className="mb-3">주문번호 : {orderItems[0].order_id}</h3>
      </div>
      <ul className="space-y-4 pt-5 py-10">
        {orderItems.map((item) => (
          <DetailOrderItem key={item.id} item={item} />
        ))}
      </ul>
      <hr />
      <hr />
      {/* 주문자정보, 배송정보, 결제정보, 결제수단*/}
      <div className="border rounded-md px-4 py-5 mt-10 mb-5">
        <h3 className="font-bold border-b pb-2">주문자 정보</h3>
        <ul className="flex flex-col justify-between gap-2 text-sm pt-4">
          <OrderCustomerInfoItem item={customerInfo} />
        </ul>
      </div>
      <div className="flex flex-col gap-5">
        <PaymentOverview title="배송 정보" payment={payment} />
        <PaymentOverview title="결제 정보" payment={payment} />
        <PaymentOverview title="결제 수단" payment={payment} />
      </div>
    </div>
  );
};

export default OrderDetail;
