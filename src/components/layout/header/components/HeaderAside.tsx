"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  ChevronRight,
  Crown,
  LogOut,
  Menu,
  MessageSquare,
  Moon,
  Music,
  Newspaper,
  ShoppingBag,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";
import LogoImage from "@/assets/images/logo_black.svg";
import WhiteLogoImage from "@/assets/images/logo.svg";
import UserAvatar from "@/components/common/UserAvatar";
import MembershipBadge from "@/components/mypage/MembershipBadge";
import LoginLink from "@/components/auth/login/LoginLink";
import { GNB_ARRAY } from "@/utils/constants";
import { useMyMembership } from "@/hooks/queries/useMembership";
import useSignOut from "@/hooks/useSignOut";
import { useCartItems, useSession } from "@/store/zustand";
import { cn } from "@/utils/utils";

const GNB_ICONS: Record<string, LucideIcon> = {
  "/news": Newspaper,
  "/discography": Music,
  "/shop": ShoppingBag,
  "/board": MessageSquare,
};

//모바일 좌측 드로어 메뉴 — 프로필 카드 + 퀵 타일 + GNB + 테마·로그아웃 (.pen "모바일 메뉴" 시안)
const HeaderAside = () => {
  const session = useSession();
  const pathname = usePathname();
  const cartItems = useCartItems();
  const { tier } = useMyMembership();
  const { resolvedTheme, setTheme } = useTheme();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  const { handleSignOut } = useSignOut(() => closeRef.current?.click());

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = mounted ? cartItems.length : 0;
  const isDark = mounted && resolvedTheme === "dark";

  const toggleTheme = () => {
    //전환 순간에만 전역 트랜지션 활성화 — 평소 hover 등에는 영향 없음
    document.documentElement.classList.add("theme-transition");
    setTheme(isDark ? "light" : "dark");
    window.setTimeout(() => document.documentElement.classList.remove("theme-transition"), 400);
  };

  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger aria-label="메뉴 열기">
          <Menu size={25} />
        </SheetTrigger>
        <SheetContent side="left" className="flex w-[320px] max-w-[85vw] flex-col p-0">
          <SheetHeader className="px-5 pb-2 pt-4">
            <SheetTitle className="relative h-auto w-[34px]">
              <SheetClose asChild>
                <Link href="/" aria-label="홈으로 이동">
                  <Image src={LogoImage} alt="IVE DIVE" className="fill dark:hidden" />
                  <Image src={WhiteLogoImage} alt="IVE DIVE" className="fill hidden dark:block" />
                </Link>
              </SheetClose>
            </SheetTitle>
            <SheetDescription className="sr-only">모바일 내비게이션 메뉴</SheetDescription>
          </SheetHeader>
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4 pt-1">
            {/* 프로필 카드 / 로그인 카드 */}
            {session ? (
              <SheetClose asChild>
                <Link
                  href="/mypage"
                  className="flex items-center gap-3 rounded-2xl bg-purple-50 p-3.5 transition-colors hover:bg-purple-100"
                >
                  <UserAvatar
                    size="md"
                    className={cn("!h-11 !w-11", tier !== "free" && "ring-[1.5px] ring-purple-300")}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className="truncate text-sm font-bold">{session.user.user_metadata.name}</span>
                      <MembershipBadge tier={tier} size="sm" />
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] text-gray-400">{session.user.email}</span>
                  </span>
                  <ChevronRight size={16} className="shrink-0 text-gray-400" aria-hidden="true" />
                </Link>
              </SheetClose>
            ) : (
              <div className="flex flex-col gap-2.5 rounded-2xl bg-purple-50 p-4">
                <p className="text-[13px] font-semibold">로그인하고 다이브를 시작해보세요</p>
                <SheetClose asChild>
                  <LoginLink className="flex h-10 w-full items-center justify-center rounded-full bg-purple-300 text-[13px] font-bold text-white transition-colors hover:bg-purple-400">
                    로그인
                  </LoginLink>
                </SheetClose>
                <p className="text-center text-[11px] text-gray-400">
                  아직 계정이 없나요?{" "}
                  <SheetClose asChild>
                    <Link href="/signup" className="font-bold text-purple-500 underline underline-offset-2 dark:text-purple-300">
                      회원가입
                    </Link>
                  </SheetClose>
                </p>
              </div>
            )}
            {/* 퀵 타일 — 장바구니 · 멤버십 */}
            <div className="grid grid-cols-2 gap-2.5">
              <SheetClose asChild>
                <Link
                  href="/cart"
                  className="flex flex-col gap-2 rounded-xl border border-gray-200 p-3.5 transition-colors hover:bg-gray-50"
                >
                  <span className="flex items-center justify-between">
                    <ShoppingCart size={18} className="text-purple-400" aria-hidden="true" />
                    {cartCount > 0 && (
                      <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-purple-300 px-1 text-[10px] font-bold leading-none text-white">
                        {cartCount}
                      </span>
                    )}
                  </span>
                  <span className="text-[13px] font-semibold">장바구니</span>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/mypage/membership"
                  className="flex flex-col gap-2 rounded-xl border border-gray-200 p-3.5 transition-colors hover:bg-gray-50"
                >
                  <span className="flex items-center justify-between">
                    <Crown size={18} className="text-purple-400" aria-hidden="true" />
                    <span className="text-[10px] font-bold text-orange-500">NEW</span>
                  </span>
                  <span className="text-[13px] font-semibold">멤버십</span>
                </Link>
              </SheetClose>
            </div>
            {/* GNB */}
            <nav aria-label="주요 메뉴">
              <p className="px-1 pb-1 text-[11px] font-semibold text-gray-400">메뉴</p>
              <ul className="flex flex-col gap-0.5">
                {GNB_ARRAY.map((menu) => {
                  const Icon = GNB_ICONS[menu.path];
                  const active = pathname.startsWith(menu.path);

                  return (
                    <li key={menu.path}>
                      <SheetClose asChild>
                        <Link
                          href={menu.path}
                          className={cn(
                            "flex items-center justify-between rounded-lg px-2.5 py-3 transition-colors",
                            active ? "bg-purple-50 dark:bg-purple-50" : "hover:bg-gray-50",
                          )}
                        >
                          <span className="flex items-center gap-2.5">
                            {Icon && (
                              <Icon
                                size={17}
                                className={active ? "text-purple-500 dark:text-purple-300" : "text-gray-400"}
                                aria-hidden="true"
                              />
                            )}
                            <span
                              className={cn(
                                "text-sm",
                                active ? "font-semibold text-purple-500 dark:text-purple-300" : "",
                              )}
                            >
                              {menu.label}
                            </span>
                          </span>
                          <ChevronRight size={14} className="text-gray-300" aria-hidden="true" />
                        </Link>
                      </SheetClose>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
          {/* 하단 고정 — 다크 모드 · 로그아웃 */}
          <div className="border-t border-gray-200 px-4 py-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex w-full items-center justify-between rounded-lg px-2.5 py-2.5 transition-colors hover:bg-gray-50"
              aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
            >
              <span className="flex items-center gap-2.5">
                <Moon size={16} className="text-gray-500" aria-hidden="true" />
                <span className="text-[13px]">다크 모드</span>
              </span>
              <span
                className={cn(
                  "relative h-5 w-9 rounded-full transition-colors",
                  isDark ? "bg-purple-300" : "bg-gray-300",
                )}
                aria-hidden="true"
              >
                <span
                  className={cn(
                    "absolute left-0 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
                    isDark ? "translate-x-[18px]" : "translate-x-0.5",
                  )}
                />
              </span>
            </button>
            {session && (
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left transition-colors hover:bg-gray-50"
              >
                <LogOut size={16} className="text-gray-400" aria-hidden="true" />
                <span className="text-[13px] text-gray-500">로그아웃</span>
              </button>
            )}
          </div>
          <SheetClose ref={closeRef} className="hidden" />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default HeaderAside;
