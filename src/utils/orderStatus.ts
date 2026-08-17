import { DELIVERY_STATUS } from "./constants";

export interface OrderStatusBadge {
  label: string;
  /** 텍스트 전용 표기 (요약 카드) */
  textClass: string;
  /** 칩 표기 (주문 상세 헤더) */
  chipClass: string;
}

//배송 단계별 색 — 진행 중은 보라, 완료는 초록 계열로 구분한다
const DELIVERY_BADGE: Record<string, OrderStatusBadge> = {
  [DELIVERY_STATUS.READY]: {
    label: DELIVERY_STATUS.READY,
    textClass: "text-purple-500 dark:text-purple-300",
    chipClass: "bg-purple-50 text-purple-500 dark:text-purple-300",
  },
  [DELIVERY_STATUS.SHIPPING]: {
    label: DELIVERY_STATUS.SHIPPING,
    textClass: "text-orange-500",
    chipClass: "bg-orange-50 text-orange-500",
  },
  [DELIVERY_STATUS.DELIVERED]: {
    label: DELIVERY_STATUS.DELIVERED,
    textClass: "text-success",
    chipClass: "bg-[#22C55E17] text-success",
  },
};

const CONFIRMED: OrderStatusBadge = {
  label: "구매확정",
  textClass: "text-success",
  chipClass: "bg-[#22C55E17] text-success",
};

const PAID: OrderStatusBadge = {
  label: "결제 완료",
  textClass: "text-purple-500 dark:text-purple-300",
  chipClass: "bg-purple-50 text-purple-500 dark:text-purple-300",
};

/**
 * 주문 상태 뱃지 — 구매확정이 최종 단계라 배송 단계보다 우선한다.
 * 아직 확정 전이면 배송 단계를 보여주고, 배송 정보가 없으면 결제 완료로 떨어진다.
 */
export const getOrderStatusBadge = (isAllConfirmed: boolean, deliveryStatus?: string | null): OrderStatusBadge => {
  if (isAllConfirmed) return CONFIRMED;
  return (deliveryStatus && DELIVERY_BADGE[deliveryStatus]) || PAID;
};
