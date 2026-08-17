import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/utils/calculateDiscount";
import { formatDate } from "@/utils/formatDate";
import { getOrderStatusBadge } from "@/utils/orderStatus";
import type { OrderSummaryProps } from "@/types/mypage";

//주문 요약 카드 — 썸네일·상태·제목·금액 + 주문 상세/리뷰 쓰기 필 (.pen "마이페이지 · 결제 내역" 시안)
const OrderSummary = ({ order }: OrderSummaryProps) => {
  const { push } = useRouter();
  const status = getOrderStatusBadge(order.isAllConfirmed, order.deliveryStatus);

  const onClickDetail = () => {
    push(`/mypage/orders/${order.orderId}`);
  };

  return (
    <li
      onClick={onClickDetail}
      className="flex cursor-pointer flex-col gap-4 rounded-2xl border border-gray-200 p-5 transition-colors hover:bg-gray-50 md:flex-row md:items-center"
    >
      <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-lg border border-gray-200">
        <Image
          src={order.firstOrderImage}
          alt={order.firstItemName}
          width={144}
          height={144}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-xs">
          <strong className={`font-bold ${status.textClass}`}>{status.label}</strong>
          <time className="text-gray-400">{formatDate(order.orderDate)} 주문</time>
        </div>
        <h3 className="mt-1.5 truncate text-[15px] font-semibold">
          {order.firstItemName}
          {order.itemCount > 1 ? ` 외 ${order.itemCount - 1}건` : ""}
        </h3>
        <strong className="mt-1 block text-[15px] font-bold">{formatPrice(order.totalAmount)}원</strong>
      </div>
      <div className="flex shrink-0 items-center gap-2" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onClickDetail}
          className="rounded-full border border-gray-300 px-3.5 py-2 text-[13px] font-semibold text-gray-500 transition-colors hover:bg-gray-50"
        >
          주문 상세
        </button>
        <button
          type="button"
          onClick={onClickDetail}
          className="rounded-full bg-purple-50 px-3.5 py-2 text-[13px] font-semibold text-purple-500 transition-colors hover:bg-purple-100 dark:text-purple-300"
        >
          리뷰 쓰기
        </button>
      </div>
    </li>
  );
};

export default OrderSummary;
