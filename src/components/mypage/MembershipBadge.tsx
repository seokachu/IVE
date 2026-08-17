import { cn } from "@/utils/utils";
import type { MembershipTier } from "@/types/mypage";

interface MembershipBadgeProps {
  tier: MembershipTier;
  /** lg: 프로필 밴드(12px), md: 게시판 닉네임 옆(10px), sm: 댓글(9px) — .pen "DIVE+ 커뮤니티 표시" 스펙 */
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: "px-[7px] py-[2px] text-[9px]",
  md: "px-2 py-[3px] text-[10px]",
  lg: "px-3 py-1 text-xs",
};

//구독 티어 뱃지 — 목록·상세·댓글·프로필 밴드 공용
const MembershipBadge = ({ tier, size = "md", className }: MembershipBadgeProps) => {
  if (tier === "free") return null;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full font-bold leading-none",
        sizeStyles[size],
        tier === "vip"
          ? "bg-gradient-to-r from-[#FDE68A] via-[#FACC15] to-[#F59E0B] text-gray-900 shadow-[0_2px_8px_rgba(250,204,21,0.5)] dark:text-[#0A0A0A]"
          : "bg-purple-300 text-white",
        className,
      )}
    >
      {tier === "vip" ? "VIP" : "DIVE+"}
    </span>
  );
};

export default MembershipBadge;
