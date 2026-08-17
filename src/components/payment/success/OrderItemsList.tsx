import OrderItemRow from "./OrderItemRow";
import type { Tables } from "@/types/supabase";
import type { OrderItemsListProps } from "@/types/payment";

const OrderItemsList = ({ orderItems }: OrderItemsListProps) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-card p-6 lg:p-7">
      <div className="flex items-center justify-between">
        <h2 className="flex items-end gap-2">
          <strong className="text-base font-bold">주문상품</strong>
          <span className="text-[13px] text-gray-400">총 {orderItems?.length}개</span>
        </h2>
        <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[11px] font-bold text-purple-500 dark:text-purple-300">
          결제 완료
        </span>
      </div>
      {orderItems && orderItems.length > 0 && (
        <ul className="mt-5 flex flex-col gap-4">
          {orderItems.map((item: Tables<"order_items">) => (
            <OrderItemRow key={item.id} item={item} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderItemsList;
