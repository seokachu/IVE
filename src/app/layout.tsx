import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/providers/ThemeProvider";
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import QueryProvider from "@/providers/QueryProvider";
import { notoSansKr } from "../assets/fonts/fonts";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "IVE-DIVE",
  description: "아이브 팬페이지 입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={notoSansKr.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <Header />
            {children}
            <Toaster />
            <Footer />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
