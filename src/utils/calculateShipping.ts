import { BADGE_TYPES, SHIPPING_POLICY } from "./constants";
import type { MembershipTier } from "@/types/mypage";

//배송비 계산에 필요한 최소 필드 — 장바구니 아이템·주문 아이템 양쪽에서 그대로 쓸 수 있다
export interface ShippingItem {
  shipping_type?: string | null;
}

//무료가 된 이유를 구분해 안내 문구를 다르게 띄운다
export type ShippingReason =
  | "empty" //담긴 상품 없음
  | "item" //전 품목이 무료배송 상품
  | "membership" //VIP 전 주문 무료배송
  | "threshold" //기준 금액 이상
  | "charged"; //배송비 부과

export interface ShippingResult {
  fee: number;
  isFree: boolean;
  reason: ShippingReason;
  /** 무료배송까지 남은 금액 — 이미 무료이거나 금액으로 해결되지 않으면 0 */
  remainingForFree: number;
}

interface CalculateShippingParams {
  items: ShippingItem[];
  /** 상품 할인까지 적용한 상품 금액 (멤버십 할인 전) */
  orderAmount: number;
  tier?: MembershipTier;
}

//조건부 무료배송 — 우선순위: 빈 장바구니 > 전 품목 무료배송 > VIP > 기준 금액 > 부과
export const calculateShipping = ({
  items,
  orderAmount,
  tier = "free",
}: CalculateShippingParams): ShippingResult => {
  const free = (reason: ShippingReason): ShippingResult => ({
    fee: 0,
    isFree: true,
    reason,
    remainingForFree: 0,
  });

  if (items.length === 0) return { ...free("empty"), isFree: false };

  //상품 자체가 무료배송이면 금액과 무관하게 면제 — 하나라도 일반배송이 섞이면 기준 금액을 따른다
  if (items.every((item) => item.shipping_type === BADGE_TYPES.FREE_DELIVERY)) {
    return free("item");
  }

  if (tier === "vip") return free("membership");

  if (orderAmount >= SHIPPING_POLICY.FREE_THRESHOLD) return free("threshold");

  return {
    fee: SHIPPING_POLICY.BASE_FEE,
    isFree: false,
    reason: "charged",
    remainingForFree: SHIPPING_POLICY.FREE_THRESHOLD - orderAmount,
  };
};
