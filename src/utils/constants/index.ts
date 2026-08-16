import type { SortOption, SortOptionList } from "@/types/shop";

//header gnb list
export const GNB_ARRAY = [
  { label: "소식", path: "/news", exact: false },
  { label: "굿즈샵", path: "/shop", exact: false },
  { label: "자유게시판", path: "/board", exact: false },
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
        text: ["- 주문자 정보 확인 및 주문 처리", "- 결제 및 환불처리", "- 주문 관련 안내 및 민원처리"],
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
        text: ["- 고객 책임 사유로 인한 제품 훼손", "- 포장 개봉 후 상품 가치 훼손"],
      },
      {
        heading: "3. 환불 처리 절차",
        text: ["- 환불 신청 접수", "- 제품 회수 및 검수", "- 환불 처리 (3-5영업일 소요)"],
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

//일정 카테고리 라벨·배지 색상
export const SCHEDULE_CATEGORY_MAP = {
  concert: { label: "콘서트", badgeClass: "bg-purple-100 text-purple-700" },
  comeback: { label: "컴백", badgeClass: "bg-pink-100 text-pink-700" },
  broadcast: { label: "방송", badgeClass: "bg-blue-100 text-blue-700" },
  fanmeeting: { label: "팬미팅", badgeClass: "bg-orange-100 text-orange-700" },
  popup: { label: "팝업", badgeClass: "bg-green-100 text-green-700" },
  release: { label: "발매", badgeClass: "bg-yellow-100 text-yellow-700" },
  etc: { label: "기타", badgeClass: "bg-gray-100 text-gray-700" },
} as const;

//일정 섹션 뷰 토글 목록
export const SCHEDULE_VIEW_ARRAY = [
  { value: "card", label: "다가오는 일정" },
  { value: "calendar", label: "캘린더" },
] as const;

//소식 페이지 뉴스 피드 한 번에 노출할 개수
export const NEWS_FEED_DEFAULT_LIMIT = 6;

//디자인 시스템 색상 토큰 — className이 아닌 JS 코드(아이콘 color, 컨페티 등)에서 사용 (public/docs/design-system.md §1)
export const COLORS = {
  white: "#ffffff",
  gray300: "#cccccc",
  purple300: "#db97e9",
  orange300: "#ff9f87",
  red: "#e72424",
  warning: "#facc15",
} as const;

//회원가입 약관 동의 내용
export const SIGNUP_AGREEMENT_CONTENTS = {
  TERMS: {
    title: "이용약관 동의",
    description: [
      {
        heading: "1. 서비스 이용",
        text: [
          "- 본 서비스는 아이브(IVE) 관련 소식·갤러리·자유게시판·굿즈샵을 제공합니다.",
          "- 회원은 본인 계정으로만 서비스를 이용할 수 있습니다.",
        ],
      },
      {
        heading: "2. 회원의 의무",
        text: [
          "- 타인의 권리를 침해하거나 부적절한 게시물을 등록할 수 없습니다.",
          "- 계정 정보는 본인이 안전하게 관리해야 합니다.",
        ],
      },
      {
        heading: "3. 서비스 제공자의 권리",
        text: [
          "- 운영 정책 위반 시 게시물 삭제 및 이용 제한이 있을 수 있습니다.",
          "- 서비스 내용은 사전 고지 후 변경될 수 있습니다.",
        ],
      },
    ],
  },
  PRIVACY: {
    title: "개인정보 수집·이용 동의",
    description: [
      {
        heading: "1. 수집 목적",
        text: ["- 회원 식별 및 로그인 서비스 제공", "- 주문·배송 및 커뮤니티 서비스 제공"],
      },
      {
        heading: "2. 수집 항목",
        text: ["- 필수항목: 이메일, 비밀번호", "- 소셜 로그인 시: 각 서비스 제공 프로필 정보"],
      },
      {
        heading: "3. 보유 기간",
        text: ["- 회원 탈퇴 시까지", "- 관련 법령에 따른 보관 기간"],
      },
    ],
  },
} as const;
