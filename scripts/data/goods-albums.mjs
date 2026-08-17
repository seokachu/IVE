/**
 * 최신 앨범 라인업 데이터 — 신규 앨범 SKU + 기존 앨범 갤러리 보강.
 *
 * 굿즈샵의 2026년 앨범이 REVIVE+ 한 종뿐이라 "최신" 영역이 비어 있었다.
 * 실제 음반은 한 앨범이 일반반·한정반·플랫폼반으로 나뉘어 팔리므로 그 구조로 채운다.
 *
 * 이미지는 새로 만들지 않고 버킷에 이미 있는 것만 쓴다 —
 * REVIVE 폴더의 공식 커버와, 중복 상품 정리 때 연결이 끊긴 공식몰 이미지 11장이 남아 있다.
 * 표지가 실제로 구분되는 4종만 추가한다 (같은 표지를 돌려쓴 타일은 목록만 지저분해진다).
 */

const IMG = "https://jzghadoanikvjvczuerw.supabase.co/storage/v1/object/public/goods";

export const ALBUM_IMAGES = {
  reviveCover: `${IMG}/REVIVE/revive.webp`, //프로젝트 자체 REVIVE+ 커버 (네이비)
  reviveBangers: `${IMG}/crawled/1933.webp`, //BANGERS Ver. 표지
  reviveComponents: `${IMG}/crawled/1933-1.webp`, //구성품 전개 컷
  empathyMd: `${IMG}/crawled/1441.webp`, //EMPATHY MD Ver. (하늘색 퍼 파우치)
  empathyDetail1: `${IMG}/crawled/1441-1.webp`,
  empathyDetail2: `${IMG}/crawled/1441-2.webp`,
  secretShh: `${IMG}/crawled/1780.webp`, //IVE SECRET Shh Ver. 표지
  secretComponents: `${IMG}/crawled/1780-1.webp`,
  mineDetail1: `${IMG}/crawled/1087-1.webp`,
  mineDetail2: `${IMG}/crawled/1087-2.webp`,
  switchDetail1: `${IMG}/crawled/1264-1.webp`,
  switchDetail2: `${IMG}/crawled/1264-2.webp`,
};

//기존 상품 보정 — 제목을 에디션이 드러나게 바꾸고, 끊겨 있던 공식몰 이미지를 갤러리에 붙인다
export const ALBUM_PATCHES = [
  {
    id: "eeee6451-fc1f-4c36-be28-ac98e1f3903c",
    title: "IVE THE 2ND ALBUM REVIVE+ (BANGERS Ver.)",
    description: [
      "PHOTO BOOK + PET COVER : 176 x 250mm / 120p / 1EA",
      "CD-R + ENVELOPE 1EA · 폴딩 포스터 420 x 297mm 1EA",
      "포토카드 랜덤 2종 (예약 구매 특전 포함)",
    ],
    images: [ALBUM_IMAGES.reviveBangers, ALBUM_IMAGES.reviveComponents],
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440024", //I'VE MINE 1st EP
    images: [`${IMG}/1-ep/album.webp`, `${IMG}/1-ep/list.webp`, ALBUM_IMAGES.mineDetail1, ALBUM_IMAGES.mineDetail2],
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440034", //IVE SWITCH 2nd EP
    images: [
      `${IMG}/2-ep/album.webp`,
      `${IMG}/2-ep/list-1.webp`,
      `${IMG}/2-ep/list-2.webp`,
      ALBUM_IMAGES.switchDetail1,
      ALBUM_IMAGES.switchDetail2,
    ],
  },
  {
    id: "dd5abea0-ea23-4ea6-a0fe-3f352edc4a04", //미니 4집 색상랜덤
    images: [
      `${IMG}/4-mini-album/4-mini-album.webp`,
      `${IMG}/4-mini-album/pink.webp`,
      `${IMG}/4-mini-album/blue.webp`,
      `${IMG}/4-mini-album/green.webp`,
      ALBUM_IMAGES.secretComponents,
    ],
  },
];

//신규 앨범 SKU — id는 스크립트가 제목으로 중복 확인 후 생성한다
export const NEW_ALBUMS = [
  {
    title: "IVE THE 2ND ALBUM REVIVE+ (한정반)",
    price: 39800,
    discount_rate: 0,
    shipping_type: "무료배송",
    delivery_info: "예약출고 (2026.08.28 출고)",
    created_at: "2026-08-05T10:00:00+09:00",
    size: "176mm x 250mm",
    color: "free",
    thumbnail: ALBUM_IMAGES.reviveCover,
    images: [ALBUM_IMAGES.reviveCover, ALBUM_IMAGES.reviveComponents],
    description: [
      "한정 수량 · 재판매 없음",
      "하드커버 PHOTO BOOK 176 x 250mm / 160p 1EA",
      "친필 사인 엽서 (랜덤 6종 중 1종) · 아크릴 스탠드 1EA",
      "미공개 포토카드 SET (6종) 포함",
    ],
  },
  {
    title: "IVE THE 2ND ALBUM REVIVE+ (POCA ALBUM)",
    price: 16500,
    discount_rate: 0,
    shipping_type: "일반배송",
    delivery_info: "당일배송",
    created_at: "2026-08-05T10:00:00+09:00",
    size: "90mm x 143mm",
    color: "free",
    thumbnail: ALBUM_IMAGES.reviveComponents,
    images: [ALBUM_IMAGES.reviveComponents, ALBUM_IMAGES.reviveCover],
    description: [
      "플랫폼 앨범 — CD가 없는 카드형 앨범입니다",
      "POCA CARD 1EA · 포토카드 랜덤 2종 · 스티커 1EA",
      "전용 앱에서 음원·포토북 열람",
    ],
  },
  {
    title: "IVE THE 4th EP IVE SECRET (Shh Ver.)",
    price: 18600,
    discount_rate: 0,
    shipping_type: "무료배송",
    delivery_info: "평일 2~3일 내 출고",
    created_at: "2025-09-02T10:00:00+09:00",
    size: "180mm x 240mm",
    color: "free",
    thumbnail: ALBUM_IMAGES.secretShh,
    images: [ALBUM_IMAGES.secretShh, ALBUM_IMAGES.secretComponents],
    description: [
      "OUT PACKAGE 180 x 240mm 1EA · PHOTO BOOK 148 x 210mm / 80p 1EA",
      "CD-R 1EA · 폴디드 포스터 400 x 280mm 1EA (예약 구매 특전)",
      "인스탄트 포토 88 x 107mm 랜덤 1종 · 포토카드 55 x 85mm 랜덤 1종",
    ],
  },
  {
    title: "IVE THE 3rd EP IVE EMPATHY (MD Ver.)",
    price: 33000,
    discount_rate: 5,
    shipping_type: "무료배송",
    delivery_info: "평일 2~3일 내 출고",
    created_at: "2025-02-14T10:00:00+09:00",
    size: "ONE SIZE",
    color: "free",
    thumbnail: ALBUM_IMAGES.empathyMd,
    images: [ALBUM_IMAGES.empathyMd, ALBUM_IMAGES.empathyDetail1, ALBUM_IMAGES.empathyDetail2],
    description: [
      "TITLE : REBEL HEART",
      "퍼 파우치 키링 (앨범 수납형) 1EA",
      "PHOTO BOOK 148 x 210mm / 88p 1EA · 포토카드 랜덤 2종",
    ],
  },
];
