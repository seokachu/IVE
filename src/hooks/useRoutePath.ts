"use client";
import { usePathname } from "next/navigation";

/**
 * 라우트 경로를 돌려준다 — 루트만 정규화한다.
 *
 * Next 16은 루트(`/`)를 프리렌더할 때 `usePathname()`에 `"/index"`를 넣는다.
 * 그래서 서버가 그린 마크업이 "메인 페이지가 아님"을 전제로 만들어지고,
 * 클라이언트에서 값이 `/`로 바뀌어도 그 사이에 리렌더를 일으키는 상태 변화가
 * 없으면 잘못된 첫 렌더가 화면에 그대로 남는다.
 * (헤더가 `relative`로 굳어 히어로를 밀어내고, 아이콘이 흰 배경 위에서
 * `text-white`로 남아 안 보이던 원인)
 *
 * 앱에 `/index` 라우트는 없으므로 루트로 되돌려 서버·클라이언트를 일치시킨다.
 */
export const useRoutePath = () => {
  const pathname = usePathname();
  return pathname === "/index" ? "/" : pathname;
};
