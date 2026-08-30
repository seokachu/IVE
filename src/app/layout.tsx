import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/providers/ThemeProvider";
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import QueryProvider from "@/providers/QueryProvider";
import { pretendard } from "../assets/fonts/fonts";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/providers/AuthProvider";
import PushTokenSync from "@/components/common/PushTokenSync";
import ThemeBridge from "@/components/common/ThemeBridge";
import AlbumPlayerBar from "@/components/main/AlbumPlayerBar";
import BottomNav from "@/components/layout/BottomNav";

export const metadata: Metadata = {
  title: "IVE DIVE",
  description: "IVE 팬페이지 입니다.",
  openGraph: {
    title: "IVE DIVE",
    description: "IVE 팬페이지 입니다.",
    images: [
      "https://res.cloudinary.com/dknj7kdek/image/upload/v1737888335/og_nb8ueg.png",
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://jzghadoanikvjvczuerw.supabase.co"
        />
        <link rel="preconnect" href="https://supabase.co" />
        <link rel="preconnect" href="https://kakaocdn.net" />
        <link rel="preconnect" href="https://img1.kakaocdn.net" />
        {/* 히어로 배경 영상 — 썸네일(i.ytimg)과 IFrame API·임베드(www.youtube)의 연결을 미리 열어둔다 */}
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="preconnect" href="https://www.youtube.com" />
      </head>
      {/* pb-tabbar: 모바일 하단 탭바만큼 본문 여백 — lg 이상은 0 */}
      <body className={`${pretendard.className} w-screen overflow-x-hidden pb-tabbar`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AuthProvider>
            <PushTokenSync />
            <ThemeBridge />
            <QueryProvider>
              <Header />
              {children}
              {/* 재생 중이면 어느 페이지에서든 유지 — 트랙이 없으면 스스로 숨는다 */}
              <AlbumPlayerBar />
              <Toaster />
            </QueryProvider>
          </AuthProvider>
          <Footer />
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
