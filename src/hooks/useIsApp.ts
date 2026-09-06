"use client";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getSnapshot = () => Boolean(window.ReactNativeWebView);
const getServerSnapshot = () => false;

/**
 * 하이브리드 앱(ive-app, react-native-webview) 셸 안에서 열렸는가.
 * 서버 렌더·하이드레이션 중에는 false 였다가 마운트 뒤 실제 값으로 바뀐다 —
 * 마크업이 아니라 동작(탭 전환 replace 등)만 갈라 써야 하이드레이션 불일치가 없다.
 */
export const useIsApp = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
