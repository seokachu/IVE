import { formatPrice } from '@/utils/calculateDiscount';
import type { PaymentDetailsProps } from '@/types/mypage';

const OrderPaymentInfo = ({ item }: PaymentDetailsProps) => {
  return (
    <>
      <li className="flex justify-between">
        <span className="text-gray-500">총 주문 금액 :</span>
        <span>{formatPrice(Number(item?.amount))} 원</span>
      </li>
      <li className="flex justify-between border-b pb-2">
        <span className="text-gray-500">총 배송비 :</span>
        {/* 추후 수정필요 */}
        <span>0 원</span>
      </li>
      <li className="flex justify-between font-medium items-center">
        <span className="text-gray-500">총 결제 금액 :</span>
        <span className="font-bold text-base">{formatPrice(Number(item?.amount))} 원</span>
      </li>
    </>
  );
};

export default OrderPaymentInfo;
