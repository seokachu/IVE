"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "@/store/zustand";

interface AvatarProps {
  userId?: string | null;
  avatarUrl?: string | null;
  userName?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const UserAvatar = ({ userId, avatarUrl, userName, size = "md", className }: AvatarProps) => {
  const session = useSession();

  const getUserImage = () => {
    if (!userId) return session?.user.user_metadata.avatar_url;
    if (session?.user.id === userId) return session?.user.user_metadata.avatar_url;
    return avatarUrl || undefined;
  };

  const getUserName = () => {
    if (!userId) return session?.user.user_metadata.name;
    if (session?.user.id === userId) return session?.user.user_metadata.name;
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
    <Avatar className={`border ${sizeStyles[size]} ${className || ""}`}>
      <AvatarImage src={imageUrl} alt={displayName || "유저 프로필"} key={avatarUrl} />
      {/* 크기는 부모(Avatar)를 꽉 채움 — 고정 px를 주면 !w-5 같은 축소 오버라이드와 어긋나 글자가 밀림 */}
      <AvatarFallback className={`h-full w-full font-bold leading-none ${fallbackTextStyles[size]} ${fallbackStyle}`}>
        {nameForFallback.slice(0, 1)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
