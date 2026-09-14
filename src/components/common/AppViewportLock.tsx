"use client";

import { useEffect } from "react";
import { useIsApp } from "@/hooks/useIsApp";

//앱에서 쓰는 viewport — 브라우저 기본값(width=device-width, initial-scale=1)에 확대 금지만 더한 것
const APP_VIEWPORT = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";

/**
 * 하이브리드 앱(ive-app WebView) 안에서만 핀치 · 더블탭 확대를 막는다.
 * 네이티브 앱처럼 화면이 고정돼야 하고, 확대되면 하단 탭바 · 시트가 화면 밖으로 밀려 되돌리기 어렵다.
 * 모바일 브라우저는 접근성(확대)을 위해 그대로 둔다 — 마운트 뒤 앱일 때만 viewport 메타를 바꾸며,
 * Android WebView · iOS WKWebView 모두 메타의 동적 변경을 즉시 반영한다.
 */
const AppViewportLock = () => {
  const isApp = useIsApp();

  useEffect(() => {
    if (!isApp) return;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
    const created = !meta;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "viewport";
      document.head.appendChild(meta);
    }
    const original = meta.content;
    meta.content = APP_VIEWPORT;
    return () => {
      if (created) meta.remove();
      else meta.content = original;
    };
  }, [isApp]);

  return null;
};

export default AppViewportLock;
