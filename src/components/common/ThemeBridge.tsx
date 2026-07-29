"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

//하이브리드 앱(WebView)에 현재 테마를 알려 네이티브 셸(상태바·세이프에어리어)이 따라오게 한다
const ThemeBridge = () => {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!resolvedTheme) return;
    window.ReactNativeWebView?.postMessage(JSON.stringify({ type: "theme", value: resolvedTheme }));
  }, [resolvedTheme]);

  return null;
};

export default ThemeBridge;
