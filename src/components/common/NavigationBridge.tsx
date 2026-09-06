"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRoutePath } from "@/hooks/useRoutePath";

declare global {
  interface Window {
    /** 네이티브 셸이 전체 리로드 없이 라우터로 이동할 때 부른다 — ive-app WebViewScreen */
    __iveNavigate?: (href: string, replace?: boolean) => void;
    /** 네이티브 셸이 Android 뒤로가기로 최상위 시트 · 모달을 닫을 때 부른다 */
    __iveCloseOverlay?: () => void;
  }
}

//열려 있는 Radix 오버레이(Sheet · Dialog · AlertDialog · vaul Drawer) — 전부 role="dialog" 콘텐츠를 포털로 그린다
const OPEN_OVERLAY_SELECTOR = '[role="dialog"][data-state="open"], [role="alertdialog"][data-state="open"]';

//하이브리드 앱의 네이티브 셸과 라우팅을 잇는다 (ive-app WebViewScreen 의 Android 뒤로가기 규칙).
//① 현재 라우트를 postMessage 로 알려 셸이 "홈 / 탭 루트 / 그 외"를 판단하게 하고,
//② window.__iveNavigate 진입점을 열어 셸이 "탭 루트 → 홈"을 SPA 이동으로 처리하게 한다(리로드 없음).
//  셸은 이 함수가 없으면(외부 결제 도메인 · 구버전 웹) location.replace 로 폴백한다.
//③ 시트 · 모달이 열려 있으면 postMessage 로 알려(overlay) 뒤로가기가 페이지를 옮기는 대신 오버레이를 닫게 하고,
//  window.__iveCloseOverlay 로 최상위 오버레이를 닫는다 — 앨범 상세 시트처럼 URL 이 안 바뀌는 전체 화면 UI 를 위해.
const NavigationBridge = () => {
  const router = useRouter();
  const pathname = useRoutePath();

  useEffect(() => {
    window.ReactNativeWebView?.postMessage(JSON.stringify({ type: "route", path: pathname }));
  }, [pathname]);

  //브라우저에서도 관찰은 돌지만(가벼움) 알림은 앱 셸이 있을 때만 나간다 — 데브툴에서 __iveCloseOverlay 로 바로 확인할 수 있다
  useEffect(() => {
    let lastOpen = false;
    const report = (force = false) => {
      const open = document.querySelectorAll(OPEN_OVERLAY_SELECTOR).length > 0;
      if (!force && open === lastOpen) return;
      lastOpen = open;
      window.ReactNativeWebView?.postMessage(JSON.stringify({ type: "overlay", open }));
    };
    //data-state 변경 · 포털 마운트/언마운트를 한 틱에 모아 한 번만 판단한다
    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      queueMicrotask(() => {
        scheduled = false;
        report();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-state"] });

    window.__iveCloseOverlay = () => {
      //Radix DismissableLayer 는 document 의 Escape keydown(capture)을 받아 최상위 레이어만 닫는다
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", code: "Escape", bubbles: true, cancelable: true }));
      //닫힌 뒤 상태를 강제로 다시 알린다 — 중첩 오버레이가 남아 있으면 셸이 다시 true 로 돌아온다
      setTimeout(() => report(true), 100);
    };
    return () => {
      observer.disconnect();
      delete window.__iveCloseOverlay;
    };
  }, []);

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
