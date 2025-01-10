"use client";

import { sessionState } from "@/store";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "./useAuth";

interface AuthGuardProps {
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
}

const AuthGuard = ({ children, loadingComponent }: AuthGuardProps) => {
  const session = useRecoilValue(sessionState);
  const { initializeAuth } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeAuth().then(() => {
      setIsInitialized(true);
    });
  }, [initializeAuth]);

  useEffect(() => {
    const showToastAndRedirect = () => {
      if (isInitialized && !session) {
        Promise.resolve(
          toast({
            title: "로그인 후 이용 가능합니다.",
            duration: 2000,
          })
        ).then(() => {
          setTimeout(() => {
            window.location.href = "/login";
          }, 1500);
        });
      }
    };
    setTimeout(showToastAndRedirect, 100);
  }, [session, isInitialized]);

  if (!isInitialized || !session) {
    return loadingComponent ?? <>{children}</>;
  }

  return <>{children}</>;
};

export default AuthGuard;
