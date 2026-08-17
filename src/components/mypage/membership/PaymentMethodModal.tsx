"use client";
import { useState } from "react";
import { CreditCard, Plus } from "lucide-react";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSession } from "@/store/zustand";
import type { MembershipRow } from "@/types/mypage";

interface PaymentMethodModalProps {
  membership: MembershipRow;
  onClose: () => void;
}

//결제 수단 변경 모달 — 현재 카드 + 새 카드 등록(토스 빌링) (.pen "결제 수단 변경 모달" 시안)
const PaymentMethodModal = ({ membership, onClose }: PaymentMethodModalProps) => {
  const session = useSession();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddCard = async () => {
    if (!session?.user?.id) return;
    try {
      setIsProcessing(true);
      const tossPayments = await loadTossPayments(process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!);
      await tossPayments.requestBillingAuth("카드", {
        customerKey: session.user.id,
        customerEmail: session.user.email,
        customerName: session.user.user_metadata.name,
        successUrl: `${window.location.origin}/mypage/membership/billing?mode=card`,
        failUrl: `${window.location.origin}/mypage/membership/billing?fail=1`,
      });
    } catch {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="rounded-3xl p-7 sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">결제 수단 변경</DialogTitle>
          <DialogDescription className="sr-only">멤버십 정기결제 카드를 변경합니다.</DialogDescription>
        </DialogHeader>
        {/* 현재 카드 */}
        <div className="flex items-center gap-3 rounded-xl border-2 border-purple-300 p-4">
          <CreditCard size={18} className="shrink-0 text-purple-500 dark:text-purple-300" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">
              {membership.card_company || "등록된 카드"} {membership.card_number || ""}
            </p>
            <p className="mt-0.5 text-[11px] text-gray-400">
              {new Date(membership.started_at).toLocaleDateString("ko-KR")} 등록
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-purple-50 px-2.5 py-1 text-[10px] font-bold text-purple-500 dark:text-purple-300">
            사용 중
          </span>
        </div>
        {/* 새 카드 등록 */}
        <button
          type="button"
          onClick={handleAddCard}
          disabled={isProcessing}
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 p-4 text-[13px] font-semibold text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-50"
        >
          <Plus size={14} aria-hidden="true" />
          {isProcessing ? "카드 등록창 여는 중..." : "새 카드 등록하기"}
        </button>
        <p className="text-center text-[11px] text-gray-400">
          카드는 토스페이먼츠 빌링에 안전하게 저장돼요 · 다음 결제일부터 적용
        </p>
        <button
          type="button"
          onClick={onClose}
          className="h-[46px] w-full rounded-full border border-gray-300 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-50"
        >
          닫기
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentMethodModal;
