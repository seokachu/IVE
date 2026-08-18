import type { SortOption, SortOptionList } from "@/types/shop";

//header gnb list
export const GNB_ARRAY = [
  { label: "소식", path: "/news", exact: false },
  { label: "음악", path: "/discography", exact: false },
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

//mypage nav — key는 SideNav 아이콘·카운트 매핑용
export const MYPAGE_GNB_ARRAY = [
  { key: "membership", label: "멤버십", path: "/mypage/membership", exact: false, isNew: true },
  { key: "wishlist", label: "찜 목록", path: "/mypage/wishlist", exact: false, isNew: false },
  { key: "orders", label: "결제 내역", path: "/mypage/orders", exact: false, isNew: false },
  { key: "posts", label: "내가 쓴 글", path: "/mypage/posts", exact: false, isNew: false },
  { key: "address", label: "배송지 관리", path: "/mypage/address", exact: false, isNew: false },
] as const;

//DIVE 멤버십 플랜 — 시안 확정: 무료 / DIVE+ 1,900 / DIVE VIP 5,900 (가격은 초기가, 추후 인상 전제)
export const MEMBERSHIP_PLANS = [
  {
    tier: "free",
    name: "베이직",
    price: 0,
    benefits: ["찜 · 게시판 · 리뷰 작성", "댓글 · 답글 푸시 알림"],
  },
  {
    tier: "plus",
    name: "DIVE+",
    price: 1900,
    benefits: ["DIVE+ 뱃지 · 아바타 퍼플 링", "신보 · 공연 소식 우선 알림", "굿즈샵 상시 5% 할인"],
  },
  {
    tier: "vip",
    name: "DIVE VIP",
    price: 5900,
    benefits: [
      "DIVE+ 혜택 전부 포함",
      "VIP 골드 뱃지",
      "굿즈샵 상시 10% 할인",
      "전 주문 무료배송",
      "신상 굿즈 24시간 우선 구매",
    ],
  },
] as const;

//굿즈샵 정렬 조건 객체 맵핑
export const SORT_OPTIONS: Record<SortOptionList, SortOption> = {
  best: { column: "review_count", ascending: false },
  latest: { column: "created_at", ascending: false },
  price_low_to_high: { column: "price", ascending: true },
  price_high_to_low: { column: "price", ascending: false },
};

export const BADGE_TYPES = {
  FREE_DELIVERY: "무료배송",
  HOT: "HOT",
  NEW: "NEW",
} as const;

//등록 후 이 기간(일) 이내면 NEW 뱃지 — goods.created_at 기준
export const GOODS_NEW_DAYS = 30;

//HOT 뱃지 — 누적 리뷰가 아니라 "최근에 반응이 뜨거운지"로 판단한다.
//누적으로 보면 오래 팔린 상품이 영구히 HOT을 점유해 신보가 절대 올라오지 못한다.
export const GOODS_HOT = {
  WINDOW_DAYS: 90,
  MIN_RECENT_REVIEWS: 5,
  MIN_RATING: 4,
} as const;

//주문 배송 단계 — payments.delivery_status에 저장되는 값
export const DELIVERY_STATUS = {
  READY: "배송전",
  SHIPPING: "배송중",
  DELIVERED: "배송완료",
} as const;

//배송 정책 — 기본 3,000원, 상품 금액이 기준을 넘으면 무료
//(상품 자체가 무료배송이거나 VIP 멤버십이면 금액과 무관하게 무료 — calculateShipping 참고)
export const SHIPPING_POLICY = {
  BASE_FEE: 3000,
  FREE_THRESHOLD: 30000,
} as const;

//자유게시판 필터 필
export const BOARD_FILTER_PILLS = [
  { value: "all", label: "전체" },
  { value: "popular", label: "인기" },
  { value: "notice", label: "공지" },
  { value: "mine", label: "내가 쓴 글" },
] as const;

//자유게시판 정렬 옵션
export const BOARD_SORT_OPTIONS = [
  { value: "latest", label: "최신순" },
  { value: "popular", label: "인기순" },
  { value: "comments", label: "댓글순" },
] as const;

//자유게시판 상단 고정 공지 (클릭 시 펼쳐지는 정적 공지 — DB에 공지 개념 없음)
export const BOARD_NOTICE = {
  title: "자유게시판 이용 규칙 & 팬 에티켓 안내 (필독)",
  rules: [
    {
      heading: "서로 존중해요",
      body: "멤버·다른 팬덤·회원을 향한 비방과 저격 글은 확인 즉시 삭제될 수 있어요. 의견이 달라도 따뜻하게 이야기해요.",
    },
    {
      heading: "스포일러는 제목에 [스포]를 붙여주세요",
      body: "콘서트 셋리스트·미공개 콘텐츠 내용은 제목만 보고도 피할 수 있게 표기해 주세요.",
    },
    {
      heading: "현금 거래(양도·판매) 글은 금지예요",
      body: "사기 위험이 있어 삭제됩니다. 포카·굿즈 나눔과 교환은 언제나 환영이에요.",
    },
    {
      heading: "광고·도배 글은 정리될 수 있어요",
      body: "동일·유사한 글을 반복해서 올리면 일부만 남기고 정리됩니다.",
    },
  ],
  footer: "즐거운 라운지를 함께 만들어 주셔서 감사해요. 오늘도 편하게 다이브하세요 🌊",
};

//좋아요가 이 값 이상이면 리스트에서 오렌지 하이라이트
export const BOARD_HOT_LIKE_THRESHOLD = 50;

//작성 후 이 시간(시간 단위) 이내면 NEW 도트 표시
export const BOARD_NEW_POST_HOURS = 24;

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
  concert: { label: "콘서트", badgeClass: "bg-purple-100 text-purple-500" },
  comeback: { label: "컴백", badgeClass: "bg-pink-100 text-pink-700" },
  broadcast: { label: "방송", badgeClass: "bg-blue-100 text-blue-700" },
  fanmeeting: { label: "팬미팅", badgeClass: "bg-orange-100 text-orange-500" },
  popup: { label: "팝업", badgeClass: "bg-green-100 text-green-700" },
  release: { label: "발매", badgeClass: "bg-yellow-100 text-yellow-700" },
  etc: { label: "기타", badgeClass: "bg-gray-100 text-gray-700" },
} as const;


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
