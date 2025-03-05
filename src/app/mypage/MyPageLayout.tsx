"use client";

import GoTopButton from "@/components/common/button/GoTopButton";
import MyPageLoading from "@/components/common/loading/MyPageLoading";
import MyPageSkeleton from "@/components/common/loading/MyPageSkeleton";
import UserInfo from "@/components/mypage/UserInfo";
import AuthGuard from "@/hooks/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

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
          <div className="max-w-[1320px] m-auto flex flex-col lg:flex-row">
            <aside className="w-full lg:min-h-screen lg:w-[30%] lg:border-r px-5 pt-14 lg:px-8">
              <MyPageSkeleton />
            </aside>
            <section className="w-full lg:w-[70%]">
              <MyPageLoading />
            </section>
          </div>
        </main>
      }
    >
      <main className="w-full min-h-screen">
        <div className="max-w-[1320px] m-auto flex flex-col lg:flex-row">
          <aside className="w-full lg:min-h-screen lg:w-[30%] lg:border-r px-5 pt-14 lg:px-8">
            <UserInfo />
          </aside>
          <section className="w-full lg:w-[70%]">{children}</section>
        </div>
        <GoTopButton />
      </main>
    </AuthGuard>
  );
};

export default MyPageLayout;
