import { formatPrice } from "@/utils/calculateDiscount";

interface OrderPriceSummaryProps {
  totalDiscountedPrice: number;
  totalOriginalPrice: number;
  totalDiscountAmount: number;
}

const OrderPriceSummary = ({
  totalDiscountedPrice,
  totalOriginalPrice,
  totalDiscountAmount,
}: OrderPriceSummaryProps) => {
  return (
    <div className="mb-12">
      <h2 className="font-bold text-lg lg:text-xl mb-5">결제 금액</h2>
      <div className="border-b pb-3 flex justify-between items-center">
        <p>총 결제 금액</p>
        <p>
          <strong className="text-lg lg:text-xl mr-1 text-purple">
            {formatPrice(totalDiscountedPrice)}
          </strong>
          원
        </p>
      </div>
      <div className="pt-5">
        <p className="mb-1 flex justify-between items-center">
          상품 금액
          <span>{formatPrice(totalOriginalPrice)}원</span>
        </p>
        <p className="flex justify-between items-center">
          총 할인 금액
          <span className="text-dark-orange">
            -{formatPrice(totalDiscountAmount)}원
          </span>
        </p>
      </div>
    </div>
  );
};

export default OrderPriceSummary;
