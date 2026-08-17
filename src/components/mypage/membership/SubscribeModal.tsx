"use client";
import { useState } from "react";
import { Crown } from "lucide-react";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { formatPrice } from "@/utils/calculateDiscount";
import { useSession } from "@/store/zustand";
import type { MembershipTier } from "@/types/mypage";

interface SubscribeModalProps {
  tier: Exclude<MembershipTier, "free">;
  price: number;
  name: string;
  onClose: () => void;
}

//구독 시작 모달 — 약관 동의 후 토스 빌링 카드 등록으로 이동 (.pen "멤버십 구독 모달" 시안)
const SubscribeModal = ({ tier, price, name, onClose }: SubscribeModalProps) => {
  const session = useSession();
  const [agreeBilling, setAgreeBilling] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const billingDay = new Date().getDate();

  const handleSubscribe = async () => {
    if (!session?.user?.id) return;
    if (!agreeBilling || !agreeTerms) {
      toast({ title: "약관 동의가 필요합니다.", description: "필수 약관에 모두 동의해주세요.", variant: "destructive" });
      return;
    }

    try {
      setIsProcessing(true);
      const tossPayments = await loadTossPayments(process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!);
      //카드 등록(빌링키 발급) 창 — 등록 완료 시 successUrl로 authKey가 전달된다
      await tossPayments.requestBillingAuth("카드", {
        customerKey: session.user.id,
        customerEmail: session.user.email,
        customerName: session.user.user_metadata.name,
        successUrl: `${window.location.origin}/mypage/membership/billing?tier=${tier}`,
        failUrl: `${window.location.origin}/mypage/membership/billing?fail=1`,
      });
    } catch {
      //사용자가 결제창을 닫은 경우 포함
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="rounded-3xl p-7 sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">{name} 구독하기</DialogTitle>
          <DialogDescription className="sr-only">멤버십 정기결제를 시작합니다.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-3 rounded-xl bg-purple-50 p-4">
          <Crown size={20} className="shrink-0 text-purple-500 dark:text-purple-300" aria-hidden="true" />
          <div>
            <p className="text-sm font-bold">
              {name} · 월 {formatPrice(price)}원
            </p>
            <p className="mt-0.5 text-xs text-gray-500">오늘 결제 후 매월 {billingDay}일 자동 결제</p>
          </div>
        </div>
        <div className="flex flex-col gap-2.5">
          <label className="flex cursor-pointer items-center gap-2 text-[13px]">
            <input type="checkbox" checked={agreeBilling} onChange={(e) => setAgreeBilling(e.target.checked)} />
            정기결제 이용약관 동의 (필수)
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-[13px]">
            <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
            멤버십 이용약관 동의 (필수)
          </label>
        </div>
        <hr className="border-gray-200" />
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">오늘 결제 금액</span>
          <strong className="text-lg font-bold text-purple-500 dark:text-purple-300">{formatPrice(price)}원</strong>
        </div>
        <button
          type="button"
          onClick={handleSubscribe}
          disabled={isProcessing}
          className="h-[46px] w-full rounded-full bg-gradient-to-r from-purple-400 to-orange-300 text-sm font-bold text-white shadow-[0_4px_14px_rgba(219,151,233,0.35)] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isProcessing ? "결제창 여는 중..." : "결제하고 시작하기"}
        </button>
        <p className="text-center text-[11px] text-gray-400">토스페이먼츠 빌링으로 안전하게 결제돼요</p>
      </DialogContent>
    </Dialog>
  );
};

export default SubscribeModal;
