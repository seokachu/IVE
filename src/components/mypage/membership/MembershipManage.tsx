"use client";
import { useState } from "react";
import { ArrowUpDown, CalendarClock, Check, Crown, HeartCrack, RotateCcw } from "lucide-react";
import MembershipBadge from "@/components/mypage/MembershipBadge";
import MyPageTitle from "@/components/mypage/MyPageTitle";
import ChangePlanModal from "@/components/mypage/membership/ChangePlanModal";
import PaymentMethodModal from "@/components/mypage/membership/PaymentMethodModal";
import ConfirmModal from "@/components/common/modal/ConfirmModal";
import { useInvalidateMembership } from "@/hooks/queries/useMembership";
import { getRemainingDays } from "@/lib/supabase/membership";
import { MEMBERSHIP_PLANS } from "@/utils/constants";
import { formatPrice } from "@/utils/calculateDiscount";
import { formatDate } from "@/utils/formatDate";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/utils/utils";
import type { MembershipRow } from "@/types/mypage";

interface MembershipManageProps {
  membership: MembershipRow;
}

//구독 중 관리 화면 — 상태 카드 + 결제 정보/혜택 + 해지 (.pen "마이페이지 · 멤버십 · 구독 중" 시안)
const MembershipManage = ({ membership }: MembershipManageProps) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const invalidateMembership = useInvalidateMembership();

  const plan = MEMBERSHIP_PLANS.find((item) => item.tier === membership.tier);
  const planName = plan?.name ?? "DIVE+";
  const pendingPlan = MEMBERSHIP_PLANS.find((item) => item.tier === membership.pending_tier);
  const isCanceled = membership.status === "canceled";
  const nextBillingDate = formatDate(membership.next_billing_at);
  const remainingDays = getRemainingDays(membership.next_billing_at);

  const handleCancelPlanChange = async () => {
    try {
      const res = await fetch("/api/membership/change-plan", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      invalidateMembership();
      toast({
        title: "플랜 변경 예약이 취소되었습니다.",
        description: `${planName}을 그대로 이용해요.`,
      });
    } catch (error) {
      toast({
        title: "예약 취소에 실패했습니다.",
        description: error instanceof Error ? error.message : "다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = async () => {
    try {
      const res = await fetch("/api/membership/cancel", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      invalidateMembership();
      toast({
        title: "멤버십이 해지되었습니다.",
        description: `${nextBillingDate}까지 혜택은 그대로 유지돼요.`,
      });
    } catch (error) {
      toast({
        title: "해지에 실패했습니다.",
        description: error instanceof Error ? error.message : "다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  //해지 취소 — 남은 혜택 기간 안에서만 가능하고 추가 결제는 없다
  const handleResume = async () => {
    try {
      const res = await fetch("/api/membership/cancel", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      invalidateMembership();
      toast({
        title: "해지가 취소되었습니다.",
        description: `${planName}을 그대로 이용하고 ${nextBillingDate}에 다시 결제돼요.`,
      });
    } catch (error) {
      toast({
        title: "해지 취소에 실패했습니다.",
        description: error instanceof Error ? error.message : "다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  const infoRows = [
    isCanceled
      ? { label: "혜택 종료일", value: `${nextBillingDate} (이후 자동 결제 없음)` }
      : { label: "다음 결제일", value: nextBillingDate },
    { label: "월 요금", value: `${formatPrice(membership.price)}원` },
    { label: "결제 수단", value: `${membership.card_company || "카드"} ${membership.card_number || ""}` },
    { label: "구독 시작일", value: formatDate(membership.started_at) },
    ...(isCanceled && membership.canceled_at
      ? [{ label: "해지 신청일", value: formatDate(membership.canceled_at) }]
      : []),
  ];

  return (
    <div>
      <MyPageTitle title="멤버십" />
      {/* 구독 상태 카드 — 해지 예정이면 오렌지 경고 톤으로 구분 */}
      <div
        className={cn(
          "flex flex-col gap-4 rounded-2xl p-6 md:flex-row md:items-center md:justify-between",
          isCanceled ? "bg-orange-100" : "bg-purple-50",
        )}
      >
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {isCanceled ? (
              <CalendarClock size={18} className="text-orange-500" aria-hidden="true" />
            ) : (
              <Crown size={18} className="text-purple-500 dark:text-purple-300" aria-hidden="true" />
            )}
            <h3 className="text-base font-bold">{planName} 구독 중</h3>
            <MembershipBadge tier={membership.tier} size="md" />
            {isCanceled && (
              <span className="rounded-full bg-orange-500 px-2 py-[3px] text-[10px] font-bold leading-none text-white">
                해지 예정
              </span>
            )}
          </div>
          <p className="mt-1.5 text-[13px] text-gray-500">
            {isCanceled
              ? `${nextBillingDate}에 혜택이 종료돼요 · ${remainingDays === 0 ? "오늘까지" : `${remainingDays}일 남음`}`
              : `${formatDate(membership.started_at)}부터 이용 중`}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2 self-start sm:self-auto">
          {isCanceled ? (
            <button
              type="button"
              onClick={() => setIsResumeModalOpen(true)}
              className="flex items-center gap-1.5 rounded-full bg-purple-300 px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-purple-400"
            >
              <RotateCcw size={14} aria-hidden="true" />
              해지 취소
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(true)}
                className="rounded-full border border-gray-300 px-4 py-2 text-[13px] font-semibold text-gray-500 transition-colors hover:bg-white/60 dark:hover:bg-white/10"
              >
                결제 수단 변경
              </button>
              <button
                type="button"
                onClick={() => setIsPlanModalOpen(true)}
                className="flex items-center gap-1.5 rounded-full bg-purple-300 px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-purple-400"
              >
                <ArrowUpDown size={14} aria-hidden="true" />
                플랜 변경
              </button>
            </>
          )}
        </div>
      </div>
      {/* 해지 예정 안내 — 되돌리는 법·재구독 방법 */}
      {isCanceled && (
        <div className="mt-3 rounded-xl border border-orange-300 px-4 py-3.5">
          <p className="text-[13px] font-semibold">해지를 취소하면 지금 플랜 그대로 이어져요</p>
          <p className="mt-1 text-[13px] text-gray-500">
            {nextBillingDate}까지는 혜택이 유지되고, 그전에 해지를 취소하면 추가 결제 없이 구독이 계속돼요. 다른 플랜으로
            바꾸고 싶다면 해지를 취소한 뒤 플랜 변경을 이용해주세요. 혜택 종료 후에는 플랜 화면에서 다시 구독할 수
            있어요.
          </p>
        </div>
      )}
      {/* 다운그레이드 예약 안내 */}
      {!isCanceled && pendingPlan && (
        <div className="mt-3 flex flex-col gap-2 rounded-xl border border-gray-200 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-[13px] font-semibold">
            <CalendarClock size={15} className="shrink-0 text-orange-500" aria-hidden="true" />
            {nextBillingDate}부터 {pendingPlan.name}로 변경될 예정이에요 · 그때까지 {planName} 혜택은 유지돼요
          </p>
          <button
            type="button"
            onClick={handleCancelPlanChange}
            className="shrink-0 self-start text-[13px] text-gray-400 underline underline-offset-2 transition-colors hover:text-gray-500 sm:self-auto"
          >
            변경 취소
          </button>
        </div>
      )}
      {/* 결제 정보 · 혜택 */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 p-6">
          <h3 className="text-[15px] font-bold">결제 정보</h3>
          <ul className="mt-3.5 space-y-2.5 text-[13px]">
            {infoRows.map((row) => (
              <li key={row.label} className="flex items-center justify-between gap-3">
                <span className="text-gray-400">{row.label}</span>
                <span className="font-semibold">{row.value}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-gray-200 p-6">
          <h3 className="text-[15px] font-bold">이용 중인 혜택</h3>
          <ul className="mt-3.5 space-y-2.5 text-[13px]">
            {(plan?.benefits ?? []).map((benefit) => (
              <li key={benefit} className="flex items-center gap-2">
                <Check size={14} className="text-purple-400" aria-hidden="true" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {!isCanceled && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => setIsCancelModalOpen(true)}
            className="text-[13px] text-gray-300 underline underline-offset-2 transition-colors hover:text-gray-400"
          >
            멤버십 해지하기
          </button>
        </div>
      )}
      {isPaymentModalOpen && (
        <PaymentMethodModal membership={membership} onClose={() => setIsPaymentModalOpen(false)} />
      )}
      {isPlanModalOpen && <ChangePlanModal membership={membership} onClose={() => setIsPlanModalOpen(false)} />}
      {isCancelModalOpen && (
        <ConfirmModal
          isOpen={setIsCancelModalOpen}
          onConfirm={handleCancel}
          title="DIVE 멤버십을 해지할까요?"
          description={`다음 결제일(${nextBillingDate})까지 혜택은 그대로 유지돼요.`}
          cancelText="유지하기"
          confirmText="해지하기"
          variant="destructive"
          icon={<HeartCrack size={22} className="text-[#E72424]" />}
        />
      )}
      {isResumeModalOpen && (
        <ConfirmModal
          isOpen={setIsResumeModalOpen}
          onConfirm={handleResume}
          title="해지를 취소할까요?"
          description={`${planName} 구독이 그대로 이어지고, ${nextBillingDate}에 ${formatPrice(membership.price)}원이 결제돼요.`}
          cancelText="닫기"
          confirmText="해지 취소하기"
          icon={<RotateCcw size={22} className="text-purple-400" />}
        />
      )}
    </div>
  );
};

export default MembershipManage;
