/** @type {import('next').NextConfig} */
const config = {
  outputFileTracingRoot: import.meta.dirname,
  async redirects() {
    return [
      {
        source: "/docs",
        destination: "/docs/index.html",
        permanent: false,
      },
    ];
  },
  images: {
    //Vercel Hobby 이미지 최적화 할당량 초과로 /_next/image가 402(OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED)를 반환해
    //캐시 안 된 이미지가 전부 깨지는 문제 — 원본을 직접 서빙하도록 전역 비활성화 (굿즈 이미지는 이미 WebP로 사전 최적화됨)
    //플랜 업그레이드 시 이 줄만 제거하면 최적화가 복구된다 (뉴스 썸네일은 URL 회전이 잦아 개별 unoptimized 유지)
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jzghadoanikvjvczuerw.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "*.ytimg.com",
        port: "",
        pathname: "/vi/**",
      },
      {
        protocol: "http",
        hostname: "www.kopis.or.kr",
        port: "",
        pathname: "/upload/**",
      },
      {
        protocol: "https",
        hostname: "search.pstatic.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.mzstatic.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default config;
