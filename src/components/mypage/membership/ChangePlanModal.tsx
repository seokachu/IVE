"use client";
import { useState } from "react";
import { CalendarClock, Crown, Sparkles, Zap } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import MembershipBadge, { VIP_GOLD } from "@/components/mypage/MembershipBadge";
import { useInvalidateMembership } from "@/hooks/queries/useMembership";
import { toast } from "@/hooks/use-toast";
import { MEMBERSHIP_DISCOUNT_RATES } from "@/lib/supabase/membership";
import { formatPrice } from "@/utils/calculateDiscount";
import { getProratedUpgradeAmount, getRemainingDays } from "@/utils/calculateProration";
import { MEMBERSHIP_PLANS } from "@/utils/constants";
import { formatDate } from "@/utils/formatDate";
import { cn } from "@/utils/utils";
import type { MembershipRow, MembershipTier } from "@/types/mypage";

type PaidTier = Exclude<MembershipTier, "free">;

interface ChangePlanModalProps {
  membership: MembershipRow;
  onClose: () => void;
}

const PAID_PLANS = MEMBERSHIP_PLANS.filter((plan) => plan.tier !== "free");
const PLAN_ICONS = { plus: Crown, vip: Sparkles } as const;

//플랜 변경 모달 — 업그레이드는 차액 즉시 결제, 다운그레이드는 다음 결제일 예약 (.pen "플랜 변경 모달" 시안)
const ChangePlanModal = ({ membership, onClose }: ChangePlanModalProps) => {
  const otherTier = PAID_PLANS.find((plan) => plan.tier !== membership.tier)!.tier as PaidTier;
  const [selectedTier, setSelectedTier] = useState<PaidTier>(membership.pending_tier ?? otherTier);
  const [isProcessing, setIsProcessing] = useState(false);
  const invalidateMembership = useInvalidateMembership();

  const selectedPlan = PAID_PLANS.find((plan) => plan.tier === selectedTier)!;
  const isUpgrade = selectedPlan.price > membership.price;
  const nextBillingDate = formatDate(membership.next_billing_at);
  const chargeAmount = getProratedUpgradeAmount(membership.price, selectedPlan.price, membership.next_billing_at);
  const remainingDays = getRemainingDays(membership.next_billing_at);
  //VIP를 고르면 안내·CTA까지 골드 톤으로 — 티어가 바뀐다는 걸 색으로 먼저 알린다
  const isVipSelected = selectedTier === "vip";

  const handleSubmit = async () => {
    try {
      setIsProcessing(true);
      const res = await fetch("/api/membership/change-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: selectedTier }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      invalidateMembership();
      onClose();
      toast({
        title: isUpgrade ? `${selectedPlan.name}으로 업그레이드했어요.` : "플랜 변경이 예약되었습니다.",
        description: isUpgrade
          ? "지금부터 바로 혜택이 적용돼요."
          : `${nextBillingDate}부터 ${selectedPlan.name}로 변경돼요.`,
      });
    } catch (error) {
      toast({
        title: "플랜 변경에 실패했습니다.",
        description: error instanceof Error ? error.message : "다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="rounded-3xl p-7 sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">플랜 변경</DialogTitle>
          <DialogDescription className="sr-only">이용 중인 멤버십 플랜을 변경합니다.</DialogDescription>
        </DialogHeader>
        {/* 플랜 선택 */}
        <div className="flex flex-col gap-2.5">
          {PAID_PLANS.map((plan) => {
            const isCurrent = plan.tier === membership.tier;
            const isSelected = plan.tier === selectedTier;
            const isVipRow = plan.tier === "vip";
            const PlanIcon = PLAN_ICONS[plan.tier as PaidTier];

            return (
              <button
                key={plan.tier}
                type="button"
                onClick={() => setSelectedTier(plan.tier as PaidTier)}
                aria-pressed={isSelected}
                className={cn(
                  "flex items-center gap-3 rounded-xl p-3.5 text-left transition-colors",
                  isSelected
                    ? cn("border-2", isVipRow ? `${VIP_GOLD.border} ${VIP_GOLD.soft}` : "border-purple-300")
                    : "border border-gray-200 hover:bg-gray-50",
                )}
              >
                <span
                  className={cn(
                    "size-[18px] shrink-0 rounded-full border",
                    isSelected
                      ? cn("border-[5px]", isVipRow ? VIP_GOLD.border : "border-purple-300")
                      : "border-gray-300",
                  )}
                  aria-hidden="true"
                />
                <PlanIcon
                  size={18}
                  className={cn(
                    "shrink-0",
                    !isSelected
                      ? "text-gray-400"
                      : isVipRow
                        ? VIP_GOLD.icon
                        : "text-purple-500 dark:text-purple-300",
                  )}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "truncate text-sm font-semibold",
                        isVipRow ? VIP_GOLD.text : "text-purple-500 dark:text-purple-300",
                      )}
                    >
                      {plan.name}
                    </span>
                    {isVipRow && <MembershipBadge tier="vip" size="sm" />}
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] text-gray-400">
                    월 {formatPrice(plan.price)}원 · 굿즈샵 상시 {MEMBERSHIP_DISCOUNT_RATES[plan.tier] * 100}% 할인
                  </span>
                </span>
                {isCurrent ? (
                  <span className="shrink-0 rounded-full border border-gray-200 px-2.5 py-1 text-[10px] font-bold text-gray-400">
                    현재 플랜
                  </span>
                ) : (
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold",
                      isVipRow
                        ? `${VIP_GOLD.soft} ${VIP_GOLD.text}`
                        : "bg-purple-50 text-purple-500 dark:text-purple-300",
                    )}
                  >
                    {plan.price > membership.price ? "업그레이드" : "변경 예정"}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {/* 변경 안내 */}
        <div className={cn("flex flex-col gap-1.5 rounded-xl p-3.5", isVipSelected ? VIP_GOLD.soft : "bg-purple-50")}>
          <p
            className={cn(
              "flex items-center gap-2 text-[13px] font-bold",
              isVipSelected ? VIP_GOLD.text : "text-purple-500 dark:text-purple-300",
            )}
          >
            {isUpgrade ? (
              <Zap size={14} className="shrink-0" aria-hidden="true" />
            ) : (
              <CalendarClock size={14} className="shrink-0" aria-hidden="true" />
            )}
            {isUpgrade
              ? `오늘 ${formatPrice(chargeAmount)}원만 결제하면 바로 적용돼요`
              : `다음 결제일부터 ${selectedPlan.name}로 변경돼요`}
          </p>
          <p className="text-xs leading-relaxed text-gray-500">
            {isUpgrade
              ? `남은 ${remainingDays}일치 차액이에요. 다음 결제일(${nextBillingDate})부터는 월 ${formatPrice(selectedPlan.price)}원이 결제되고, 혜택은 결제 즉시 시작돼요.`
              : `${nextBillingDate}까지는 현재 혜택이 그대로 유지되고, 추가 결제나 환불은 없어요. 그 전까지 언제든 변경을 취소할 수 있어요.`}
          </p>
        </div>
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="h-[46px] flex-1 rounded-full border border-gray-300 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isProcessing}
            className={cn(
              "h-[46px] flex-1 rounded-full text-sm font-bold text-white disabled:opacity-50",
              //둘 다 결제로 이어지는 액션 — VIP 업그레이드는 골드, 다운그레이드 예약은 결제 버튼과 같은 그라데이션
              isUpgrade
                ? `${VIP_GOLD.gradient} ${VIP_GOLD.glow} !text-gray-900 transition-opacity hover:opacity-90`
                : "bg-gradient-to-r from-purple-400 to-orange-300 shadow-[0_4px_14px_rgba(219,151,233,0.35)] transition-opacity hover:opacity-90",
            )}
          >
            {isProcessing ? "변경 중..." : isUpgrade ? "업그레이드하기" : "다음 결제일부터 변경"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePlanModal;
