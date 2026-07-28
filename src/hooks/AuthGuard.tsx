"use client";

import React, { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "./useAuth";
import { useSession } from "@/store/zustand";

interface AuthGuardProps {
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
}

const AuthGuard = ({ children, loadingComponent }: AuthGuardProps) => {
  const session = useSession();
  const { initializeAuth } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeAuth().then(() => {
      setIsInitialized(true);
    });
  }, [initializeAuth]);

  useEffect(() => {
    if (!isInitialized || session) return;

    //세션 복원이 끝나기 전에 성급하게 튕기지 않도록 잠깐 기다렸다가 이동한다.
    //그 사이 세션이 생기면 effect가 재실행되며 아래 cleanup으로 타이머가 취소된다.
    let redirectTimer: ReturnType<typeof setTimeout>;
    const checkTimer = setTimeout(() => {
      toast({
        title: "로그인 후 이용 가능합니다.",
        duration: 2000,
      });
      redirectTimer = setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    }, 300);

    return () => {
      clearTimeout(checkTimer);
      clearTimeout(redirectTimer);
    };
  }, [session, isInitialized]);

  if (!isInitialized || !session) {
    return loadingComponent ?? <>{children}</>;
  }

  return <>{children}</>;
};

export default AuthGuard;
