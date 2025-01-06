"use client";

import { sessionState } from "@/store";
import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { toast } from "@/hooks/use-toast";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const session = useRecoilValue(sessionState);

  useEffect(() => {
    const showToastAndRedirect = () => {
      if (!session) {
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
  }, [session]);

  if (!session) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
