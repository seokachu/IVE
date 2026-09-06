"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRoutePath } from "@/hooks/useRoutePath";

declare global {
  interface Window {
    /** 네이티브 셸이 전체 리로드 없이 라우터로 이동할 때 부른다 — ive-app WebViewScreen */
    __iveNavigate?: (href: string, replace?: boolean) => void;
  }
}

//하이브리드 앱의 네이티브 셸과 라우팅을 잇는다 (ive-app WebViewScreen 의 Android 뒤로가기 규칙).
//① 현재 라우트를 postMessage 로 알려 셸이 "홈 / 탭 루트 / 그 외"를 판단하게 하고,
//② window.__iveNavigate 진입점을 열어 셸이 "탭 루트 → 홈"을 SPA 이동으로 처리하게 한다(리로드 없음).
//  셸은 이 함수가 없으면(외부 결제 도메인 · 구버전 웹) location.replace 로 폴백한다.
const NavigationBridge = () => {
  const router = useRouter();
  const pathname = useRoutePath();

  useEffect(() => {
    window.ReactNativeWebView?.postMessage(JSON.stringify({ type: "route", path: pathname }));
  }, [pathname]);

  useEffect(() => {
    window.__iveNavigate = (href, replace = false) => {
      if (replace) router.replace(href);
      else router.push(href);
    };
    return () => {
      delete window.__iveNavigate;
    };
  }, [router]);

  return null;
};

export default NavigationBridge;
