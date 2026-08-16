import type { DiscographyItem } from "@/lib/album/sync";

//카드·시트·히어로가 공유하는 발매 구분 배지 스타일
export const CATEGORY_BADGE_CLASS: Record<DiscographyItem["category"], string> = {
  정규: "bg-purple text-white",
  미니: "bg-purple-100 text-purple-500",
  싱글: "bg-gray-200 text-gray-700 dark:bg-white/15 dark:text-white",
} as const;

//항상 어두운 히어로 전용 — 테마 플립 없는 고정 hex (다크 모드에서 purple-100이 플립돼 배지가 배경에 묻히는 문제)
export const CATEGORY_BADGE_CLASS_ON_DARK: Record<DiscographyItem["category"], string> = {
  정규: "bg-purple text-white",
  미니: "bg-[#F5E3F8] text-[#A94FC0]",
  싱글: "bg-white/15 text-white",
} as const;

export const formatReleaseDate = (isoDate: string) => isoDate.slice(0, 10).replaceAll("-", ".");
