import AppleMusicIcon from "@/assets/images/apple_music_icon.avif";
import MelonMusicIcon from "@/assets/images/Melon_music_icon.avif";
import FloMusicIcon from "@/assets/images/flo_music_icon.avif";
import BugsMusicIcon from "@/assets/images/bugs_music_icon.avif";
import GenieMusicIcon from "@/assets/images/genie_music_icon.avif";
import type { SortOption, SortOptionList } from "@/types";

//header gnb list
export const GNB_ARRAY = [
  { label: "소식", path: "/news" },
  { label: "굿즈샵", path: "/shop" },
  { label: "자유게시판", path: "/board" },
];

//main album music icon list
export const MUSIC_ICONS = [
  { icon: AppleMusicIcon, label: "apple" },
  { icon: MelonMusicIcon, label: "Melon" },
  { icon: FloMusicIcon, label: "FLO" },
  { icon: BugsMusicIcon, label: "Bugs" },
  { icon: GenieMusicIcon, label: "Genie" },
];

//shop sort options
export const PRODUCT_SORT_OPTIONS = [
  { value: "best", title: "인기순" },
  { value: "latest", title: "최신순" },
  { value: "price_low_to_high", title: "가격 낮은 순" },
  { value: "price_high_to_low", title: "가격 높은 순" },
];

//굿즈샵 정렬 조건 객체 맵핑
export const SORT_OPTIONS: Record<SortOptionList, SortOption> = {
  best: { column: "review_count", ascending: false },
  latest: { column: "created_at", ascending: false },
  price_low_to_high: { column: "price", ascending: true },
  price_high_to_low: { column: "price", ascending: false },
};
