import { formatPrice } from "@/utils/calculateDiscount";
import RollingNumber from "@/components/common/RollingNumber";
import { MEMBERSHIP_DISCOUNT_RATES } from "@/lib/supabase/membership";
import { SHIPPING_POLICY } from "@/utils/constants";
import type { OrderPriceSummaryProps } from "@/types/cart";

//무료가 된 이유별 안내 문구 — 왜 0원인지 보이지 않으면 오히려 불신이 생긴다
const FREE_SHIPPING_LABEL: Record<string, string> = {
  item: "전 품목 무료배송 상품이에요",
  membership: "VIP 멤버십 전 주문 무료배송이 적용됐어요",
  threshold: `${formatPrice(SHIPPING_POLICY.FREE_THRESHOLD)}원 이상 구매로 무료배송이에요`,
};

const OrderPriceSummary = ({
  totalDiscountedPrice,
  totalOriginalPrice,
  totalDiscountAmount,
  membershipDiscount = 0,
  membershipTier = "free",
  shipping,
}: OrderPriceSummaryProps) => {
  const membershipLabel = membershipTier === "vip" ? "VIP" : "DIVE+";
  const membershipRate = Math.round(MEMBERSHIP_DISCOUNT_RATES[membershipTier] * 100);

  const shippingFee = shipping?.fee ?? 0;
  const freeShippingLabel = shipping?.isFree ? FREE_SHIPPING_LABEL[shipping.reason] : undefined;
  const remainingForFree = shipping?.remainingForFree ?? 0;

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
          <dd className="font-semibold">{shippingFee > 0 ? `${formatPrice(shippingFee)}원` : "무료"}</dd>
        </div>
      </dl>
      {freeShippingLabel && <p className="mt-2 text-xs text-purple-500 dark:text-purple-300">{freeShippingLabel}</p>}
      {remainingForFree > 0 && (
        <p className="mt-2 text-xs text-gray-500">
          <strong className="font-semibold text-purple-500 dark:text-purple-300">
            {formatPrice(remainingForFree)}원
          </strong>
          {" "}더 담으면 무료배송이에요
        </p>
      )}
      <div className="mt-4 flex items-end justify-between border-t border-gray-200 pt-4">
        <span className="text-sm font-semibold">총 결제 금액</span>
        <span className="flex items-end gap-0.5">
          <strong className="text-[26px] font-bold leading-none text-purple-500 dark:text-purple-300">
            {/* 수량·선택 변경으로 총액이 바뀌면 자릿수가 세로로 굴러가는 롤링 애니메이션 */}
            <RollingNumber value={totalDiscountedPrice - membershipDiscount + shippingFee} />
          </strong>
          <span className="text-[15px] font-semibold leading-tight">원</span>
        </span>
      </div>
    </div>
  );
};

export default OrderPriceSummary;
