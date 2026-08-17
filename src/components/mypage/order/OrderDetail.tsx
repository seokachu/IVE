import { ArrowLeft } from "lucide-react";
import DetailOrderItem from "./DetailOrderItem";
import PaymentOverview from "./PaymentOverview";
import { formatDate } from "@/utils/formatDate";
import { usePayment } from "@/hooks/queries/usePayment";
import { useConfirmOrder } from "@/hooks/queries/useOrderItems";
import type { OrderDetailProps } from "@/types/mypage";

//주문 상세 — 백 필 + 상태 뱃지 + 아이템 박스 + 배송/결제 카드 (.pen "마이페이지 · 주문 상세" 시안)
const OrderDetail = ({ orderItems, onBack }: OrderDetailProps) => {
  const { data: payment } = usePayment(orderItems[0].order_id);
  const { mutate: confirmOrder } = useConfirmOrder();

  const isAllConfirmed = orderItems.every((item) => item.is_confirmed);

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-5 flex items-center gap-1.5 rounded-full border border-gray-300 px-3.5 py-2 text-[13px] font-semibold text-gray-500 transition-colors hover:bg-gray-50"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        결제 내역으로
      </button>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[22px] font-bold leading-tight">주문 상세</h2>
        <span
          className={`rounded-full px-3 py-1.5 text-xs font-bold ${
            isAllConfirmed ? "bg-[#22C55E17] text-success" : "bg-purple-50 text-purple-500 dark:text-purple-300"
          }`}
        >
          {isAllConfirmed ? "구매확정" : "결제 완료"}
        </span>
      </div>
      <p className="mt-2 text-[13px] text-gray-400">
        <time>{formatDate(orderItems[0].created_at)} 결제</time>
        <span className="mx-2" aria-hidden="true">
          ·
        </span>
        주문번호 {orderItems[0].order_id}
      </p>
      {/* 주문 상품 */}
      <ul className="mt-5 overflow-hidden rounded-2xl border border-gray-200">
        {orderItems.map((item, index) => (
          <DetailOrderItem
            key={item.id}
            item={item}
            onConfirm={() => confirmOrder(item.id)}
            isLast={index === orderItems.length - 1}
          />
        ))}
      </ul>
      {/* 배송지·결제수단·결제 정보 */}
      <div className="mt-4 flex flex-col gap-4 lg:flex-row">
        <PaymentOverview title="배송 정보" payment={payment} />
        <PaymentOverview title="결제 수단" payment={payment} />
      </div>
      <div className="mt-4">
        <PaymentOverview title="결제 정보" payment={payment} />
      </div>
    </div>
  );
};

export default OrderDetail;
