import { formatPaymentDate } from "@/utils/formatDate";
import type { PaymentDetailsProps } from "@/types/mypage";

const OrderPaymentDetails = ({ item }: PaymentDetailsProps) => {
  return (
    <>
      <li className="flex">
        <span className="w-[80px] shrink-0 text-gray-400">결제 방법</span>
        <span>{item?.payment_method}</span>
      </li>
      <li className="flex">
        <span className="w-[80px] shrink-0 text-gray-400">할부</span>
        <span>{Number(item?.installment_months) > 0 ? `${item?.installment_months}개월 할부` : "일시불"}</span>
      </li>
      <li className="flex">
        <span className="w-[80px] shrink-0 text-gray-400">결제 일시</span>
        <span>{item?.created_at ? formatPaymentDate(item.created_at) : "-"}</span>
      </li>
      <li className="flex">
        <span className="w-[80px] shrink-0 text-gray-400">주문 상태</span>
        <span>{item?.status}</span>
      </li>
    </>
  );
};

export default OrderPaymentDetails;
