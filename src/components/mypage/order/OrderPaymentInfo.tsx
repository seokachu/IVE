import { formatPrice } from "@/utils/calculateDiscount";
import type { PaymentDetailsProps } from "@/types/mypage";

const OrderPaymentInfo = ({ item }: PaymentDetailsProps) => {
  //amount는 배송비까지 포함된 최종 결제 금액 — 상품 금액은 배송비를 빼서 되돌린다
  const totalAmount = Number(item?.amount ?? 0);
  const shippingFee = item?.shipping_fee ?? 0;
  const productAmount = totalAmount - shippingFee;

  return (
    <>
      <li className="flex justify-between">
        <span className="text-gray-400">총 주문 금액</span>
        <span className="font-semibold">{formatPrice(productAmount)}원</span>
      </li>
      <li className="flex justify-between">
        <span className="text-gray-400">배송비</span>
        <span className="font-semibold">{shippingFee > 0 ? `${formatPrice(shippingFee)}원` : "무료"}</span>
      </li>
      <li className="flex items-end justify-between border-t border-gray-200 pt-2.5 font-medium">
        <span className="text-gray-400">총 결제 금액</span>
        <span className="text-base font-bold text-purple-500 dark:text-purple-300">
          {formatPrice(totalAmount)}원
        </span>
      </li>
    </>
  );
};

export default OrderPaymentInfo;
