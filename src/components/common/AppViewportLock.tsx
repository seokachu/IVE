"use client";

import { useEffect } from "react";
import { useIsApp } from "@/hooks/useIsApp";
import { useRoutePath } from "@/hooks/useRoutePath";

//앱에서 쓰는 viewport — 브라우저 기본값(width=device-width, initial-scale=1)에 확대 금지만 더한 것
const APP_VIEWPORT = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
const DEFAULT_VIEWPORT = "width=device-width, initial-scale=1";

/**
 * 하이브리드 앱(ive-app WebView) 안에서만 핀치 · 더블탭 확대를 막는다.
 * 네이티브 앱처럼 화면이 고정돼야 하고, 확대되면 하단 탭바 · 시트가 화면 밖으로 밀려 되돌리기 어렵다.
 * 모바일 브라우저는 접근성(확대)을 위해 그대로 둔다 — 마운트 뒤 앱일 때만 적용한다.
 *
 * Next 는 라우트 이동(뒤로가기 포함)마다 <head> 의 viewport 메타를 새 요소로 갈아끼우므로
 * 한 번 바꿔 두는 것으로는 부족하다 — MutationObserver 로 메타가 다시 생기거나 바뀔 때마다 잠금값을 되돌리고,
 * 메타와 별개로 Chromium(Android WebView)이 존중하는 CSS touch-action 으로 핀치 · 더블탭 줌 제스처 자체도 막는다.
 */
const AppViewportLock = () => {
  const isApp = useIsApp();
  //경로가 바뀔 때도 재적용 — 옵저버가 놓치는 경우의 안전장치
  const pathname = useRoutePath();

  useEffect(() => {
    if (!isApp) return;

    const lock = () => {
      let meta = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "viewport";
        document.head.appendChild(meta);
      }
      //같은 값이면 건드리지 않는다 — 옵저버가 자기 변경에 다시 반응하지 않게
      if (meta.content !== APP_VIEWPORT) meta.content = APP_VIEWPORT;
    };

    lock();
    document.documentElement.style.touchAction = "pan-x pan-y";

    const observer = new MutationObserver(lock);
    observer.observe(document.head, { childList: true, subtree: true, attributes: true, attributeFilter: ["content", "name"] });

    return () => {
      observer.disconnect();
      document.documentElement.style.touchAction = "";
      const meta = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
      if (meta) meta.content = DEFAULT_VIEWPORT;
    };
  }, [isApp, pathname]);

  return null;
};

export default AppViewportLock;
