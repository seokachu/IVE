import AppleMusicIcon from "@/assets/images/apple_music_icon.avif";
import MelonMusicIcon from "@/assets/images/Melon_music_icon.avif";
import FloMusicIcon from "@/assets/images/flo_music_icon.avif";
import BugsMusicIcon from "@/assets/images/bugs_music_icon.avif";
import GenieMusicIcon from "@/assets/images/genie_music_icon.avif";

//header gnb list
export const gnbArray = [
  { label: "소식", path: "/news" },
  { label: "굿즈샵", path: "/shop" },
  { label: "자유게시판", path: "/board" },
];

//main album music icon list
export const musicIcon = [
  { icon: AppleMusicIcon, label: "apple" },
  { icon: MelonMusicIcon, label: "Melon" },
  { icon: FloMusicIcon, label: "FLO" },
  { icon: BugsMusicIcon, label: "Bugs" },
  { icon: GenieMusicIcon, label: "Genie" },
];

//shop sort options
export const productSortOptions = [
  { value: "best", title: "인기순" },
  { value: "latest", title: "최신순" },
];
