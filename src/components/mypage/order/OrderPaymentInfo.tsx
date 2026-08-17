import { formatPrice } from "@/utils/calculateDiscount";
import type { PaymentDetailsProps } from "@/types/mypage";

const OrderPaymentInfo = ({ item }: PaymentDetailsProps) => {
  return (
    <>
      <li className="flex justify-between">
        <span className="text-gray-400">총 주문 금액</span>
        <span className="font-semibold">{formatPrice(Number(item?.amount))}원</span>
      </li>
      <li className="flex justify-between">
        <span className="text-gray-400">배송비</span>
        <span className="font-semibold">무료</span>
      </li>
      <li className="flex items-end justify-between border-t border-gray-200 pt-2.5 font-medium">
        <span className="text-gray-400">총 결제 금액</span>
        <span className="text-base font-bold text-purple-500 dark:text-purple-300">
          {formatPrice(Number(item?.amount))}원
        </span>
      </li>
    </>
  );
};

export default OrderPaymentInfo;
