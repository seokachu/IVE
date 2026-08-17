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

//VIP 골드 톤 — 뱃지·링·강조 UI가 같은 값을 쓰도록 한곳에 모은다
export const VIP_GOLD = {
  gradient: "bg-gradient-to-r from-[#FDE68A] via-[#FACC15] to-[#F59E0B]",
  border: "border-[#FACC15]",
  ring: "ring-[#FACC15]",
  text: "text-[#B45309] dark:text-[#FACC15]",
  icon: "text-[#EAB308]",
  soft: "bg-[#FACC15]/10",
  glow: "shadow-[0_2px_8px_rgba(250,204,21,0.5)]",
} as const;

//멤버십 아바타 링 공통 규칙 — 일반 없음 · DIVE+ 퍼플 · VIP 골드(VIP 뱃지와 같은 골드 톤)
//두께는 눈에 띄게(제미나이 링 참고) — 그림자 없는 곳에서도 티어가 읽혀야 한다
export const getMembershipRingClass = (tier: MembershipTier, width: "thin" | "thick" = "thin"): string => {
  if (tier === "free") return "";
  const ringWidth = width === "thin" ? "ring-2" : "ring-[3px]";
  const ringColor = tier === "vip" ? VIP_GOLD.ring : "ring-purple-300";
  return `${ringWidth} ${ringColor}`;
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
          ? cn(
              VIP_GOLD.gradient,
              "text-gray-900 dark:text-[#0A0A0A]",
              //글로우는 md 이상만 — 댓글(sm)에서는 그림자가 뱃지 원을 부풀려 보이게 한다
              size !== "sm" && VIP_GOLD.glow,
            )
          : "bg-purple-300 text-white",
        className,
      )}
    >
      {tier === "vip" ? "VIP" : "DIVE+"}
    </span>
  );
};

export default MembershipBadge;
