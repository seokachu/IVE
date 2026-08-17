"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getMembershipRingClass } from "@/components/mypage/MembershipBadge";
import { useMembershipTier, useMyMembership } from "@/hooks/queries/useMembership";
import { useSession } from "@/store/zustand";
import { cn } from "@/utils/utils";
import { getAvatarUrl, getDisplayName } from "@/utils/userProfile";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  userId?: string | null;
  avatarUrl?: string | null;
  userName?: string | null;
  size?: AvatarSize;
  /** 멤버십 링 — 링을 직접 그리는 곳(프로필 밴드 VIP 그라데이션)에서만 끈다 */
  ring?: boolean;
  className?: string;
}

const UserAvatar = ({ userId, avatarUrl, userName, size = "md", ring = true, className }: AvatarProps) => {
  const session = useSession();
  //userId가 없거나 나 자신이면 내 세션 기준 — 남의 아바타만 공개 뷰에서 티어를 조회한다
  const isMe = !userId || session?.user.id === userId;
  const { tier: myTier } = useMyMembership();
  const otherTier = useMembershipTier(isMe ? null : userId);
  const tier = isMe ? myTier : otherTier;

  const getUserImage = () => {
    if (isMe) return getAvatarUrl(session?.user);
    return avatarUrl || undefined;
  };

  const getUserName = () => {
    if (isMe) return getDisplayName(session?.user);
    return userName || undefined;
  };

  const imageUrl = getUserImage();
  const displayName = getUserName();

  const sizeStyles = {
    xs: "w-[25px] h-[25px]",
    sm: "w-[30px] h-[30px]",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const fallbackTextStyles = {
    xs: "text-[11px]",
    sm: "text-xs",
    md: "text-[15px]",
    lg: "text-base",
    xl: "text-xl",
  };

  //링 두께는 아바타 크기를 따라간다 — 작은 아바타에 굵은 링이 붙으면 원이 커 보인다
  const ringWidth: Record<AvatarSize, "thin" | "thick"> = {
    xs: "thin",
    sm: "thin",
    md: "thin",
    lg: "thick",
    xl: "thick",
  };

  //시안 기준: 이미지 없으면 이름 첫 글자 파스텔 이니셜 서클 — 이름 해시로 색 고정 (리뷰 아바타와 동일 규칙)
  const fallbackPalette = [
    "bg-purple-100 text-purple-500",
    "bg-orange-100 text-orange-500",
    "bg-gray-100 text-gray-600",
    "bg-purple-50 text-purple-400",
  ];
  const nameForFallback = displayName || "유저";
  const nameHash = [...nameForFallback].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const fallbackStyle = fallbackPalette[nameHash % fallbackPalette.length];

  return (
    <Avatar
      className={cn("border", sizeStyles[size], ring && getMembershipRingClass(tier, ringWidth[size]), className)}
    >
      <AvatarImage src={imageUrl} alt={displayName || "유저 프로필"} key={imageUrl} />
      {/* 크기는 부모(Avatar)를 꽉 채움 — 고정 px를 주면 !w-5 같은 축소 오버라이드와 어긋나 글자가 밀림 */}
      <AvatarFallback className={`h-full w-full font-bold leading-none ${fallbackTextStyles[size]} ${fallbackStyle}`}>
        {nameForFallback.slice(0, 1)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
