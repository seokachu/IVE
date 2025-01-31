import Image from "next/image";
import ActionButton from "@/components/common/button/ActionButton";
import { formatPrice } from "@/utils/calculateDiscount";
import { formatDate } from "@/utils/formatDate";
import type { OrderSummaryProps } from "@/types";
import { useRouter } from "next/navigation";

const OrderSummary = ({ order }: OrderSummaryProps) => {
  const { push } = useRouter();

  const onClickDetail = () => {
    push(`/mypage/orders/${order.orderId}`);
  };

  return (
    <li className="border rounded-sm py-3 lg:py-4 px-3 lg:px-6 hover:bg-gray-50">
      <div className="py-2 border-b flex gap-2 justify-between items-center text-xs lg:text-sm">
        <h3 className="text-gray-500">주문번호 : {order.orderId}</h3>
        <ActionButton
          variant="default"
          onClick={onClickDetail}
          className="border-0"
        >
          주문상세
        </ActionButton>
      </div>
      <div className="flex justify-between items-center pt-5">
        <div className="flex gap-3 items-center">
          <div className="relative overflow-hidden rounded-md w-[80px] h-[80px]">
            <Image
              src={order.firstOrderImage}
              alt={order.firstItemName}
              width={500}
              height={500}
              className="object-cover border"
            />
          </div>
          <div>
            <h3 className="text-sm lg:text-base font-bold my-1">
              {order.firstItemName}
              {order.itemCount > 1 ? ` 외 ${order.itemCount - 1}건` : ""}
            </h3>
            <p className="text-xs lg:text-sm text-gray-500">
              총 수량 : {order.itemCount}
            </p>
          </div>
        </div>
        <div className="text-right">
          <time className="text-xs lg:text-sm text-gray-500">
            {formatDate(order.orderDate)}
          </time>
          <strong className="text-sm lg:text-base my-1 block">
            {formatPrice(order.totalAmount)}원
          </strong>
        </div>
      </div>
    </li>
  );
};

export default OrderSummary;
