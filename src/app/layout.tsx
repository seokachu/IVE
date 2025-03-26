import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/providers/ThemeProvider";
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import QueryProvider from "@/providers/QueryProvider";
import { notoSansKr } from "../assets/fonts/fonts";
import { Toaster } from "@/components/ui/toaster";
import RecoilProvider from "@/providers/RecoilProvider";

export const metadata: Metadata = {
  title: "IVE-DIVE",
  description: "IVE 팬페이지 입니다.",
  openGraph: {
    title: "IVE-DIVE",
    description: "IVE 팬페이지 입니다.",
    images: ["https://res.cloudinary.com/dknj7kdek/image/upload/v1737888335/og_nb8ueg.png"],
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
        <link rel="preconnect" href="https://jzghadoanikvjvczuerw.supabase.co" />
        <link rel="preconnect" href="https://supabase.co" />
        <link rel="preconnect" href="https://kakaocdn.net" />
        <link rel="preconnect" href="https://img1.kakaocdn.net" />
      </head>
      <body className={`${notoSansKr.className} w-screen overflow-x-hidden`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <RecoilProvider>
            <QueryProvider>
              <Header />
              {children}
              <Toaster />
            </QueryProvider>
          </RecoilProvider>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
