"use client";

import GoTopButton from "@/components/common/button/GoTopButton";
import MyPageLoading from "@/components/common/loading/MyPageLoading";
import { Skeleton } from "@/components/ui/skeleton";
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
        //실제 셸(프로필 밴드 + 사이드 내비 + 콘텐츠)과 같은 골격의 스켈레톤 — 다른 페이지 로딩과 톤 통일
        <main className="w-full min-h-screen">
          <div className="border-b border-gray-200 bg-purple-50">
            <div className="mx-auto flex w-full max-w-container items-center gap-4 px-5 py-6 lg:gap-5 lg:px-8 lg:py-9">
              <Skeleton className="h-[72px] w-[72px] shrink-0 rounded-full lg:h-[88px] lg:w-[88px]" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-6 w-36" />
                <Skeleton className="h-4 w-52" />
              </div>
            </div>
          </div>
          <div className="mx-auto flex w-full max-w-container flex-col px-5 lg:flex-row lg:gap-12 lg:px-8">
            <aside className="hidden w-[240px] shrink-0 flex-col gap-2.5 pt-10 lg:flex">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full rounded-lg" />
              ))}
            </aside>
            <section className="min-w-0 flex-1 pb-28 pt-6 lg:pt-10">
              <MyPageLoading />
            </section>
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
