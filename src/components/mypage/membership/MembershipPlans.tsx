"use client";
import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import MembershipBadge from "@/components/mypage/MembershipBadge";
import MyPageTitle from "@/components/mypage/MyPageTitle";
import SubscribeModal from "@/components/mypage/membership/SubscribeModal";
import { useMyMembership } from "@/hooks/queries/useMembership";
import { MEMBERSHIP_PLANS } from "@/utils/constants";
import { formatPrice } from "@/utils/calculateDiscount";
import { formatDate } from "@/utils/formatDate";
import { cn } from "@/utils/utils";
import type { MembershipTier } from "@/types/mypage";

type PaidTier = Exclude<MembershipTier, "free">;

//멤버십 플랜 — 무료/DIVE+/VIP 3장, VIP가 강조 카드 (.pen "마이페이지 · 멤버십" 시안)
const MembershipPlans = () => {
  const [subscribeTier, setSubscribeTier] = useState<PaidTier | null>(null);
  //혜택이 끝난 이전 구독 — 재구독 안내와 "이전 플랜" 표시에 쓴다
  const { membership } = useMyMembership();

  const subscribePlan = MEMBERSHIP_PLANS.find((plan) => plan.tier === subscribeTier);
  const previousPlan = membership ? MEMBERSHIP_PLANS.find((plan) => plan.tier === membership.tier) : undefined;

  return (
    <div>
      <MyPageTitle title="멤버십" />
      {/* 이전 구독 종료 안내 — 다시 시작하는 길을 명확히 */}
      {membership && previousPlan && (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-orange-300 px-4 py-3.5">
          <RotateCcw size={15} className="mt-0.5 shrink-0 text-orange-500" aria-hidden="true" />
          <div>
            <p className="text-[13px] font-semibold">
              {previousPlan.name} 혜택이 {formatDate(membership.next_billing_at)}에 종료됐어요
            </p>
            <p className="mt-1 text-[13px] text-gray-500">
              아래에서 플랜을 고르면 바로 다시 시작할 수 있어요 · 뱃지와 할인 혜택도 결제 즉시 복구돼요
            </p>
          </div>
        </div>
      )}
      {/* 히어로 */}
      <div className="flex flex-col gap-4 rounded-2xl bg-purple-50 p-6 md:flex-row md:items-center md:justify-between lg:p-7">
        <div>
          <p className="text-[11px] font-bold tracking-[0.2em] text-orange-500">DIVE MEMBERSHIP</p>
          <h3 className="mt-2 text-xl font-bold">최애 활동을 업그레이드해보세요</h3>
          <p className="mt-1.5 text-[13px] text-gray-500">매달 구독으로 전용 DIVE+ 뱃지와 굿즈 혜택을 받아요</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <MembershipBadge tier="plus" size="lg" />
          <MembershipBadge tier="vip" size="lg" />
        </div>
      </div>
      {/* 플랜 카드 */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {MEMBERSHIP_PLANS.map((plan) => {
          const isVip = plan.tier === "vip";
          const isFree = plan.tier === "free";
          const isPrevious = !isFree && previousPlan?.tier === plan.tier;

          return (
            <div
              key={plan.tier}
              className={cn(
                "flex flex-col gap-3 rounded-2xl border p-6",
                isVip ? "border-2 border-purple-300 bg-purple-50" : "border-gray-200",
              )}
            >
              <div className="flex items-center justify-between">
                <h3
                  className={cn(
                    "text-[15px] font-bold",
                    !isFree && "text-purple-500 dark:text-purple-300",
                  )}
                >
                  {plan.name}
                </h3>
                <div className="flex items-center gap-1.5">
                  {isPrevious && (
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500">
                      이전 플랜
                    </span>
                  )}
                  {isVip && (
                    <span className="rounded bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white">BEST</span>
                  )}
                </div>
              </div>
              <div className="flex items-end gap-2">
                <strong className="text-2xl font-bold leading-none">
                  {isFree ? "무료" : `월 ${formatPrice(plan.price)}원`}
                </strong>
                {!isFree && <span className="text-[11px] text-gray-400">언제든 해지</span>}
              </div>
              <hr className="border-gray-200" />
              <ul className="flex flex-1 flex-col gap-2">
                {plan.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2 text-[13px]">
                    <Check size={14} className={isFree ? "text-gray-400" : "text-purple-400"} aria-hidden="true" />
                    <span className={isFree ? "text-gray-500" : ""}>{benefit}</span>
                  </li>
                ))}
              </ul>
              {isFree ? (
                <div className="flex h-11 items-center justify-center rounded-full border border-gray-200 text-[13px] font-semibold text-gray-400">
                  현재 이용 중
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setSubscribeTier(plan.tier as PaidTier)}
                  className={cn(
                    "h-11 rounded-full text-sm font-bold text-white transition-all",
                    isVip
                      ? "bg-gradient-to-r from-purple-400 to-orange-300 shadow-[0_4px_14px_rgba(219,151,233,0.35)] hover:opacity-90"
                      : "bg-purple-300 hover:bg-purple-400",
                  )}
                >
                  {plan.name} {isPrevious ? "다시 시작하기" : "시작하기"}
                </button>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-gray-400">
        구독은 매월 자동 결제 · 언제든 해지 가능 · 무료로도 기본 기능은 계속 쓸 수 있어요.
      </p>
      {subscribeTier && subscribePlan && (
        <SubscribeModal
          tier={subscribeTier}
          price={subscribePlan.price}
          name={subscribePlan.name}
          onClose={() => setSubscribeTier(null)}
        />
      )}
    </div>
  );
};

export default MembershipPlans;
