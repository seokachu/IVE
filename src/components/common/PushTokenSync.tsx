"use client";

import { useEffect } from "react";
import { useSession } from "@/store/zustand";
import { upsertPushToken } from "@/lib/supabase/pushToken";

declare global {
  interface Window {
    __IVE_PUSH__?: {
      token: string;
      platform: string;
    };
  }
}

//하이브리드 앱 WebView에서 주입한 푸시 토큰을 로그인 사용자와 연결
const PushTokenSync = () => {
  const session = useSession();

  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) return;

    const sync = () => {
      const push = window.__IVE_PUSH__;
      if (!push?.token) return;
      //실패해도 서비스 흐름에는 영향 없음
      upsertPushToken(userId, push.token, push.platform).catch(() => {});
    };

    sync();
    window.addEventListener("ive-push-token", sync);
    return () => window.removeEventListener("ive-push-token", sync);
  }, [session?.user?.id]);

  return null;
};

export default PushTokenSync;
