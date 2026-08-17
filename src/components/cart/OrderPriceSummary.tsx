import { formatPrice } from "@/utils/calculateDiscount";
import { MEMBERSHIP_DISCOUNT_RATES } from "@/lib/supabase/membership";
import type { OrderPriceSummaryProps } from "@/types/cart";

const OrderPriceSummary = ({
  totalDiscountedPrice,
  totalOriginalPrice,
  totalDiscountAmount,
  membershipDiscount = 0,
  membershipTier = "free",
}: OrderPriceSummaryProps) => {
  const membershipLabel = membershipTier === "vip" ? "VIP" : "DIVE+";
  const membershipRate = Math.round(MEMBERSHIP_DISCOUNT_RATES[membershipTier] * 100);

  return (
    <div>
      <h2 className="text-lg font-bold">결제 금액</h2>
      <dl className="mt-4 flex flex-col gap-2.5 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-gray-500">상품 금액</dt>
          <dd className="font-semibold">{formatPrice(totalOriginalPrice)}원</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-gray-500">할인 금액</dt>
          <dd className="font-semibold text-orange-500">-{formatPrice(totalDiscountAmount)}원</dd>
        </div>
        {membershipDiscount > 0 && (
          <div className="flex items-center justify-between">
            <dt className="text-gray-500">{membershipLabel} 멤버십 할인 ({membershipRate}%)</dt>
            <dd className="font-semibold text-purple-500 dark:text-purple-300">-{formatPrice(membershipDiscount)}원</dd>
          </div>
        )}
        <div className="flex items-center justify-between">
          <dt className="text-gray-500">배송비</dt>
          <dd className="font-semibold">무료</dd>
        </div>
      </dl>
      <div className="mt-4 flex items-end justify-between border-t border-gray-200 pt-4">
        <span className="text-sm font-semibold">총 결제 금액</span>
        <span className="flex items-end gap-0.5">
          <strong className="text-[26px] font-bold leading-none text-purple-500 dark:text-purple-300">
            {formatPrice(totalDiscountedPrice - membershipDiscount)}
          </strong>
          <span className="text-[15px] font-semibold leading-tight">원</span>
        </span>
      </div>
    </div>
  );
};

export default OrderPriceSummary;
