import ActionButton from "@/components/common/button/ActionButton";
import { FaArrowLeft } from "react-icons/fa";
import DetailOrderItem from "./DetailOrderItem";
import { formatDate } from "@/utils/formatDate";

interface OrderDetailProps {
  orderItems: any[];
  onBack: () => void;
}

const OrderDetail = ({ orderItems, onBack }: OrderDetailProps) => {
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
      <div className="flex justify-between border-b text-gray-500 text-xs lg:text-sm">
        <h3 className="mb-3">주문번호 : {orderItems[0].order_id}</h3>
        <time>{formatDate(orderItems[0].created_at)}</time>
      </div>
      <ul className="space-y-4 py-5">
        {orderItems.map((item) => (
          <DetailOrderItem key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
};

export default OrderDetail;
