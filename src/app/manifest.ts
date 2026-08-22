import type { MetadataRoute } from "next";

//PWA 매니페스트 — 홈 화면 설치 지원 (iOS 사파리는 설치된 PWA에서만 웹 푸시 수신 가능)
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "IVE DIVE",
    short_name: "IVE DIVE",
    description: "IVE 팬페이지 입니다.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#F465A5",
    icons: [
      { src: "/images/app-icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/images/app-icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/images/app-icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
