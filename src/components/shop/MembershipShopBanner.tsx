"use client";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import MembershipBadge from "@/components/mypage/MembershipBadge";
import { useMyMembership } from "@/hooks/queries/useMembership";
import { MEMBERSHIP_DISCOUNT_RATES } from "@/lib/supabase/membership";

//굿즈샵 상단 멤버십 밴드 — 구독자에겐 적용 중인 혜택을, 미구독자에겐 가입 유도 문구를 보여준다
const MembershipShopBanner = () => {
  const { tier } = useMyMembership();

  if (tier !== "free") {
    const rate = Math.round(MEMBERSHIP_DISCOUNT_RATES[tier] * 100);
    return (
      <div className="mt-6 flex items-center gap-2.5 rounded-2xl bg-purple-50 px-4 py-3">
        <MembershipBadge tier={tier} size="md" />
        <p className="text-[13px] text-gray-600">
          멤버십 혜택 적용 중 — 모든 굿즈에{" "}
          <b className="text-purple-500 dark:text-purple-300">상시 {rate}% 할인가</b>가 함께 표시돼요
          {tier === "vip" && " · 전 주문 무료배송"}
        </p>
      </div>
    );
  }

  return (
    <Link
      href="/mypage/membership"
      className="group mt-6 flex items-center justify-between gap-3 rounded-2xl bg-purple-50 px-4 py-3 transition-colors hover:bg-purple-100"
    >
      <span className="flex items-center gap-2.5 text-[13px] text-gray-600">
        <Sparkles size={16} className="shrink-0 fill-purple-300 text-purple-300" aria-hidden />
        <span>
          <b className="text-purple-500 dark:text-purple-300">DIVE 멤버십</b> 가입하면 굿즈샵{" "}
          <b>상시 5~10% 할인</b> — 월 1,900원부터
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-1 text-[13px] font-semibold text-purple-500 dark:text-purple-300">
        혜택 보기
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
};

export default MembershipShopBanner;
