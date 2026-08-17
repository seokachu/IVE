"use client";
import { useState } from "react";
import { Check, Crown, HeartCrack } from "lucide-react";
import MembershipBadge from "@/components/mypage/MembershipBadge";
import MyPageTitle from "@/components/mypage/MyPageTitle";
import PaymentMethodModal from "@/components/mypage/membership/PaymentMethodModal";
import ConfirmModal from "@/components/common/modal/ConfirmModal";
import { useInvalidateMembership } from "@/hooks/queries/useMembership";
import { MEMBERSHIP_PLANS } from "@/utils/constants";
import { formatPrice } from "@/utils/calculateDiscount";
import { formatDate } from "@/utils/formatDate";
import { toast } from "@/hooks/use-toast";
import type { MembershipRow } from "@/types/mypage";

interface MembershipManageProps {
  membership: MembershipRow;
}

//구독 중 관리 화면 — 상태 카드 + 결제 정보/혜택 + 해지 (.pen "마이페이지 · 멤버십 · 구독 중" 시안)
const MembershipManage = ({ membership }: MembershipManageProps) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const invalidateMembership = useInvalidateMembership();

  const plan = MEMBERSHIP_PLANS.find((item) => item.tier === membership.tier);
  const planName = plan?.name ?? "DIVE+";
  const isCanceled = membership.status === "canceled";
  const nextBillingDate = formatDate(membership.next_billing_at);

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

  const infoRows = [
    { label: "다음 결제일", value: isCanceled ? `${nextBillingDate} (혜택 종료)` : nextBillingDate },
    { label: "월 요금", value: `${formatPrice(membership.price)}원` },
    { label: "결제 수단", value: `${membership.card_company || "카드"} ${membership.card_number || ""}` },
    { label: "구독 시작일", value: formatDate(membership.started_at) },
  ];

  return (
    <div>
      <MyPageTitle title="멤버십" />
      {/* 구독 상태 카드 */}
      <div className="flex flex-col gap-4 rounded-2xl bg-purple-50 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Crown size={18} className="text-purple-500 dark:text-purple-300" aria-hidden="true" />
            <h3 className="text-base font-bold">
              {planName} {isCanceled ? "해지 예정" : "구독 중"}
            </h3>
            <MembershipBadge tier={membership.tier} size="md" />
          </div>
          <p className="mt-1.5 text-[13px] text-gray-500">
            {isCanceled
              ? `해지 완료 — ${nextBillingDate}까지 혜택이 유지돼요`
              : `${formatDate(membership.started_at)}부터 이용 중`}
          </p>
        </div>
        {!isCanceled && (
          <button
            type="button"
            onClick={() => setIsPaymentModalOpen(true)}
            className="shrink-0 self-start rounded-full border border-gray-300 px-4 py-2 text-[13px] font-semibold text-gray-500 transition-colors hover:bg-white/60 dark:hover:bg-white/10 sm:self-auto"
          >
            결제 수단 변경
          </button>
        )}
      </div>
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
    </div>
  );
};

export default MembershipManage;
