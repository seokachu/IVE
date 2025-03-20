import OrderListItem from "@/components/mypage/order/OrderListItem";
import type { Tables } from "@/types/supabase";
import type { OrderItemsListProps } from "@/types/payment";

const OrderItemsList = ({ orderItems }: OrderItemsListProps) => {
  return (
    <div className="border rounded-lg px-4 py-5 mb-8">
      <h2 className="text-base lg:text-xl mb-8 border-b pb-4">
        <strong>
          <span>주문상품 정보</span>
          <span className="inline-block -translate-y-[2px] px-2">|</span>
          <span>총 {orderItems?.length}개</span>
        </strong>
      </h2>
      {orderItems && orderItems.length > 0 && (
        <ul className="flex flex-col w-full">
          {orderItems.map((item: Tables<"order_items">) => (
            <OrderListItem key={item.id} item={item} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderItemsList;
