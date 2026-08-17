//멤버십 업그레이드 일할 계산 — 서버(결제 금액)와 모달(안내 문구)이 같은 값을 쓰도록 공용 유틸로 둔다

const DAY_MS = 1000 * 60 * 60 * 24;

//다음 결제일까지 남은 일수 — 결제 금액과 안내 문구가 어긋나지 않도록 반올림(하루는 남으면 1일)
export const getRemainingDays = (nextBillingAt: string): number => {
  const remaining = new Date(nextBillingAt).getTime() - Date.now();
  if (remaining <= 0) return 0;
  return Math.max(1, Math.round(remaining / DAY_MS));
};

//업그레이드 즉시 결제 금액 — 남은 기간 비율만큼의 요금 차액 (10원 단위 내림)
export const getProratedUpgradeAmount = (currentPrice: number, nextPrice: number, nextBillingAt: string): number => {
  const diff = nextPrice - currentPrice;
  if (diff <= 0) return 0;

  const next = new Date(nextBillingAt);
  const cycleStart = new Date(next);
  cycleStart.setMonth(cycleStart.getMonth() - 1);

  const cycle = next.getTime() - cycleStart.getTime();
  const remaining = next.getTime() - Date.now();
  if (cycle <= 0 || remaining <= 0) return 0;

  const ratio = Math.min(1, remaining / cycle);
  return Math.floor((diff * ratio) / 10) * 10;
};

//토스 카드 결제 최소 금액 — 이보다 적으면 결제 없이 티어만 올린다
export const MIN_CHARGE_AMOUNT = 100;
