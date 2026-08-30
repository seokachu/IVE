"use client";
import Link from "next/link";
import { House, MessageSquare, Music, Newspaper, ShoppingBag, type LucideIcon } from "lucide-react";
import { GNB_ARRAY } from "@/utils/constants";
import { useRoutePath } from "@/hooks/useRoutePath";
import { cn } from "@/utils/utils";

const GNB_ICONS: Record<string, LucideIcon> = {
  "/news": Newspaper,
  "/discography": Music,
  "/shop": ShoppingBag,
  "/board": MessageSquare,
};

//홈 + GNB 4개 = 5탭 (.pen "BottomNav" 시안)
const TABS = [
  { label: "홈", path: "/", exact: true, icon: House },
  ...GNB_ARRAY.map((menu) => ({ ...menu, icon: GNB_ICONS[menu.path] })),
];

//모바일(lg 미만) 하단 탭바 — iOS 글라스 스타일의 플로팅 캡슐. 데스크톱 GNB를 대신하고 드로어(HeaderAside)에는 GNB가 없다.
//캡슐 64px + 아래 8px + iOS safe-area 를 차지한다(globals.css --tabbar-h). 탭바 위에 떠야 하는 요소는 mb-tabbar, 본문 하단 여백은 pb-tabbar.
//바깥 nav 는 pointer-events 를 끊어 캡슐 옆·아래 여백에서는 밑 콘텐츠를 그대로 누를 수 있다
const BottomNav = () => {
  const pathname = useRoutePath();

  return (
    <nav aria-label="하단 메뉴" className="pointer-events-none fixed inset-x-0 bottom-0 z-50 pb-safe lg:hidden">
      <ul className="pointer-events-auto mx-4 mb-2 flex h-16 items-center rounded-full border border-glass-stroke bg-glass px-1 shadow-lg backdrop-blur-xl">
        {TABS.map(({ label, path, exact, icon: Icon }) => {
          const active = exact ? pathname === path : pathname.startsWith(path);

          return (
            <li key={path} className="h-full flex-1 p-1">
              <Link
                href={path}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-1 rounded-full text-[11px] transition-colors",
                  active ? "bg-glass-accent font-semibold text-purple-500 dark:text-purple-300" : "text-gray-500",
                )}
              >
                <Icon size={24} aria-hidden="true" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNav;
