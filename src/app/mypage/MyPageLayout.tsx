"use client";

import GoTopButton from "@/components/common/button/GoTopButton";
import Spinner from "@/components/common/Spinner";
import ProfileBand from "@/components/mypage/ProfileBand";
import SideNav, { MyPageAccountSection } from "@/components/mypage/SideNav";
import AuthGuard from "@/hooks/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

//마이페이지 셸 — 프로필 밴드 + 240px 사이드 내비 + 콘텐츠 (.pen 마이페이지 시안)
const MyPageLayout = ({ children }: { children: React.ReactNode }) => {
  const [, setIsInitialized] = useState(false);
  const { initializeAuth } = useAuth();

  useEffect(() => {
    initializeAuth().then(() => setIsInitialized(true));
  }, [initializeAuth]);

  return (
    <AuthGuard
      loadingComponent={
        <main className="w-full min-h-screen">
          <div className="h-[153px] border-b border-gray-200 bg-purple-50" />
          <div className="flex h-[400px] items-center justify-center">
            <Spinner />
          </div>
        </main>
      }
    >
      <main className="w-full min-h-screen">
        <ProfileBand />
        <div className="mx-auto flex w-full max-w-container flex-col px-5 lg:flex-row lg:gap-12 lg:px-8">
          <aside className="w-full pt-4 lg:w-[240px] lg:shrink-0 lg:pt-10">
            <SideNav />
            {/* 데스크톱: 사이드바 하단 / 모바일: 콘텐츠 아래로 이동 (.pen 모바일 시안 IA) */}
            <div className="mt-5 hidden lg:block">
              <MyPageAccountSection />
            </div>
          </aside>
          <section className="min-w-0 flex-1 pb-28 pt-6 lg:pt-10">
            {children}
            <div className="mt-12 lg:hidden">
              <MyPageAccountSection />
            </div>
          </section>
        </div>
        <GoTopButton />
      </main>
    </AuthGuard>
  );
};

export default MyPageLayout;
