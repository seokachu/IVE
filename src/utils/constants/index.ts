import AppleMusicIcon from "@/assets/images/apple_music_icon.avif";
import MelonMusicIcon from "@/assets/images/melon_music_icon.avif";
import FloMusicIcon from "@/assets/images/flo_music_icon.avif";
import BugsMusicIcon from "@/assets/images/bugs_music_icon.avif";
import GenieMusicIcon from "@/assets/images/genie_music_icon.avif";
import type { SortOption, SortOptionList } from "@/types";

//header gnb list
export const GNB_ARRAY = [
  { label: "소식", path: "/news", exact: false },
  { label: "굿즈샵", path: "/shop", exact: false },
  { label: "자유게시판", path: "/board", exact: false },
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

//mypage nav
export const MYPAGE_GNB_ARRAY = [
  { label: "찜 목록", path: "/mypage/wishlist", exact: false },
  { label: "결제 목록", path: "/mypage/orders", exact: false },
  { label: "내가 쓴 글", path: "/mypage/posts", exact: false },
  { label: "배송지 관리", path: "/mypage/address", exact: false },
];

//굿즈샵 정렬 조건 객체 맵핑
export const SORT_OPTIONS: Record<SortOptionList, SortOption> = {
  best: { column: "review_count", ascending: false },
  latest: { column: "created_at", ascending: false },
  price_low_to_high: { column: "price", ascending: true },
  price_high_to_low: { column: "price", ascending: false },
};

export const BADGE_TYPES = {
  FREE_DELIVERY: "무료배송",
  BEST: "Best👍",
} as const;

export const PAGINATION = {
  REVIEW: {
    ITEMS_PER_PAGE: 5,
    MAX_DISPLAY_PAGES: 3,
  },
  BOARD: {
    ITEMS_PER_PAGE: 10,
    MAX_DISPLAY_PAGES: 3,
  },
} as const;

//주문 약관 동의 내용
export const AGREEMENT_CONTENTS = {
  PRIVACY: {
    title: "개인정보 수집 및 이용 동의",
    description: [
      {
        heading: "1. 개인정보 수집 목적",
        text: [
          "- 주문자 정보 확인 및 주문 처리",
          "- 결제 및 환불처리",
          "- 주문 관련 안내 및 민원처리",
        ],
      },
      {
        heading: "2. 수집하는 개인정보 항목",
        text: ["- 필수항목: 이름, 휴대폰 번호, 배송주소", "- 선택항목: 이메일"],
      },
      {
        heading: "3. 개인정보 보유기간",
        text: ["- 회원 탈퇴 시까지", "- 관련 법령에 따른 보관 기간"],
      },
    ],
  },
  REFUND: {
    title: "환불 및 취소 정책",
    description: [
      {
        heading: "1. 환불 신청 기간",
        text: ["- 상품 수령 후 7일 이내", "- 제품 하자 시 30일 이내"],
      },
      {
        heading: "2. 환불 불가 사유",
        text: [
          "- 고객 책임 사유로 인한 제품 훼손",
          "- 포장 개봉 후 상품 가치 훼손",
        ],
      },
      {
        heading: "3. 환불 처리 절차",
        text: [
          "- 환불 신청 접수",
          "- 제품 회수 및 검수",
          "- 환불 처리 (3-5영업일 소요)",
        ],
      },
    ],
  },
};

//배송정보 입력 요청사항,정보 option
export const RECIPIENT_DELIVERY_OPTIONS = [
  {
    value: "메시지선택(선택사항)",
    title: "-- 메시지 선택 (선택사항) --",
    disabled: true,
  },
  {
    value: "배송 전에 미리 연락 바랍니다.",
    title: "배송 전에 미리 연락 바랍니다.",
  },
  {
    value: "부재 시 경비실에 맡겨주세요.",
    title: "부재 시 경비실에 맡겨주세요.",
  },
  {
    value: "부재 시 문 앞에 놓아주세요.",
    title: "부재 시 문 앞에 놓아주세요.",
  },
  {
    value: "빠른 배송 부탁드립니다.",
    title: "빠른 배송 부탁드립니다.",
  },
  {
    value: "택배함에 보관해 주세요.",
    title: "택배함에 보관해 주세요.",
  },
  {
    value: "직접 입력",
    title: "직접 입력",
  },
];

//휴대폰번호 입력 option
export const PHONE_OPTIONS = [
  {
    value: "010",
    title: "010",
  },
  {
    value: "011",
    title: "011",
  },
  {
    value: "016",
    title: "016",
  },
  {
    value: "017",
    title: "017",
  },
  {
    value: "018",
    title: "018",
  },
  {
    value: "019",
    title: "019",
  },
];

//news category list
export const NEWS_CATEGORY_ARRAY = [
  { category: "전체" },
  { category: "음악" },
  { category: "방송" },
  { category: "행사" },
  { category: "화보" },
];

//소식 페이지 latest news section 데이터 불러오기 5개 제한
export const LATEST_DEFAULT_LIMIT = 5;

//소식 페이지 gallery section 데이터 불러오기 6개 제한
export const GALLERY_DEFAULT_LIMIT = 6;
