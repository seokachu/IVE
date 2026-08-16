import type { DiscographyItem } from "@/lib/album/sync";

//카드·시트·히어로가 공유하는 발매 구분 배지 스타일
export const CATEGORY_BADGE_CLASS: Record<DiscographyItem["category"], string> = {
  정규: "bg-purple text-white",
  미니: "bg-purple-100 text-purple-500",
  싱글: "bg-gray-200 text-gray-700 dark:bg-white/15 dark:text-white",
} as const;

export const formatReleaseDate = (isoDate: string) => isoDate.slice(0, 10).replaceAll("-", ".");
