import Image from "next/image";
import LogoImage from "@/assets/images/logo.svg";

//썸네일 없음·로드 실패 공통 폴백 — 딥 퍼플 브랜드 카드: 어두운 그라데이션 + 로고 워터마크 (자유게시판 HOT 카드와 동일 시안)
const BrandImageFallback = () => (
  <span className="absolute inset-0 bg-gradient-to-br from-[#3B2547] via-[#57346B] to-[#1E1526]" aria-hidden="true">
    <Image
      src={LogoImage}
      alt=""
      className="absolute -right-6 -bottom-8 h-[135%] w-auto rotate-[10deg] opacity-[0.08] transition-transform duration-700 group-hover:scale-105"
    />
  </span>
);

export default BrandImageFallback;
