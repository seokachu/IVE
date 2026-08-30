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

//모바일(lg 미만) 하단 탭바 — 데스크톱 GNB를 대신한다. 드로어(HeaderAside)에는 GNB가 없다.
//높이 56px + iOS safe-area. 탭바 위에 떠야 하는 요소는 mb-tabbar, 본문 하단 여백은 pb-tabbar(globals.css --tabbar-h)
const BottomNav = () => {
  const pathname = useRoutePath();

  return (
    <nav aria-label="하단 메뉴" className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-card pb-safe lg:hidden">
      <ul className="flex h-14">
        {TABS.map(({ label, path, exact, icon: Icon }) => {
          const active = exact ? pathname === path : pathname.startsWith(path);

          return (
            <li key={path} className="flex-1">
              <Link
                href={path}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-1 text-xs transition-colors",
                  active ? "font-semibold text-purple-500 dark:text-purple-300" : "text-gray-500",
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
