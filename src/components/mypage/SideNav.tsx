"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import _ from "lodash";
import { Crown, FileText, Heart, MapPin, ShoppingBag, type LucideIcon } from "lucide-react";
import PushSettingRow from "@/components/mypage/PushSettingRow";
import { MYPAGE_GNB_ARRAY } from "@/utils/constants";
import { useWishLists } from "@/hooks/queries/useWishList";
import { useMyBoards } from "@/hooks/queries/useBoard";
import { useOrderItems } from "@/hooks/queries/useOrderItems";
import { useShippingAddresses } from "@/hooks/queries/useShippingAddress";
import { useMyMembership } from "@/hooks/queries/useMembership";
import LogoutConfirmModal from "@/components/common/modal/LogoutConfirmModal";
import WithdrawConfirmModal from "@/components/common/modal/WithdrawConfirmModal";
import { useSession } from "@/store/zustand";
import { cn } from "@/utils/utils";

const NAV_ICONS: Record<string, LucideIcon> = {
  membership: Crown,
  wishlist: Heart,
  orders: ShoppingBag,
  posts: FileText,
  address: MapPin,
};

//마이페이지 내비 — 데스크톱: 세로 리스트, 모바일: 가로 스크롤 필 탭 (.pen "마이페이지 · 모바일" 시안)
const SideNav = () => {
  const session = useSession();
  const pathname = usePathname();
  const activeRef = useRef<HTMLLIElement | null>(null);
  const { data: wishlists } = useWishLists(session?.user.id);
  const { data: myBoards } = useMyBoards(session?.user.id);
  const { data: orderItems } = useOrderItems(session?.user.id);
  const { data: addresses } = useShippingAddresses(session?.user.id);
  const { tier, isCancelScheduled } = useMyMembership();

  //멤버십 메뉴는 개수 대신 현재 구독 상태를 표기 (미구독이면 NEW 유지)
  const membershipStatus = isCancelScheduled
    ? { label: "해지 예정", className: "text-orange-500" }
    : tier === "free"
      ? null
      : { label: tier === "vip" ? "VIP" : "DIVE+", className: "text-purple-400" };

  const counts: Record<string, number | null> = {
    membership: null,
    wishlist: wishlists?.length ?? 0,
    orders: Object.keys(_.groupBy(orderItems || [], "order_id")).length,
    posts: myBoards?.length ?? 0,
    address: addresses?.length ?? 0,
  };

  const isActivePath = (path: string, exact: boolean) => (exact ? pathname === path : pathname.startsWith(path));

  //모바일 가로 탭에서 활성 탭이 보이도록 자동 스크롤
  useEffect(() => {
    if (window.innerWidth >= 1024) return;
    activeRef.current?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [pathname]);

  return (
    <nav aria-label="마이페이지 메뉴">
      <ul className="scrollbar-hide -mx-5 flex flex-row gap-1.5 overflow-x-auto px-5 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0">
        {MYPAGE_GNB_ARRAY.map((menu) => {
          const Icon = NAV_ICONS[menu.key];
          const active = isActivePath(menu.path, menu.exact);
          const count = counts[menu.key];

          return (
            <li key={menu.key} className="shrink-0 lg:shrink" ref={active ? activeRef : undefined}>
              <Link
                href={menu.path}
                className={cn(
                  "flex items-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-2 transition-colors lg:justify-between lg:gap-3 lg:rounded-lg lg:border-0 lg:px-3.5 lg:py-3",
                  active
                    ? "border-transparent bg-purple-50 dark:bg-purple-50"
                    : "border-gray-200 lg:hover:bg-gray-50",
                )}
              >
                <span className="flex items-center gap-2 lg:gap-2.5">
                  <Icon
                    size={16}
                    className={cn("lg:w-[18px] lg:h-[18px]", active ? "text-purple-500 dark:text-purple-300" : "text-gray-400")}
                    aria-hidden="true"
                  />
                  <span
                    className={cn(
                      "text-[13px] lg:text-sm",
                      active ? "font-semibold text-purple-500 dark:text-purple-300" : "text-gray-500",
                    )}
                  >
                    {menu.label}
                  </span>
                </span>
                {menu.key === "membership" && membershipStatus ? (
                  <span className={cn("text-[10px] font-bold", membershipStatus.className)}>
                    {membershipStatus.label}
                  </span>
                ) : menu.isNew ? (
                  <span className="text-[10px] font-bold text-orange-500">NEW</span>
                ) : (
                  <span className={cn("text-xs lg:text-[13px]", active ? "font-bold text-purple-400" : "text-gray-400")}>
                    {count}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

//푸시 알림 카드 + 계정 링크 — 데스크톱은 사이드바 하단, 모바일은 콘텐츠 아래 (.pen 모바일 시안 IA)
export const MyPageAccountSection = () => {
  const router = useRouter();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      <hr className="border-gray-200" />
      <PushSettingRow />
      <div className="flex items-center gap-3 px-1 pb-2 text-[13px] lg:px-3.5">
        <button
          type="button"
          onClick={() => setLogoutOpen(true)}
          className="text-gray-500 hover:text-purple-500 transition-colors"
        >
          로그아웃
        </button>
        {logoutOpen && <LogoutConfirmModal isOpen={setLogoutOpen} onSuccess={() => router.push("/")} />}
        <span className="h-2.5 w-px bg-gray-200" aria-hidden="true" />
        <button
          type="button"
          onClick={() => setWithdrawOpen(true)}
          className="text-gray-300 hover:text-gray-400 transition-colors"
        >
          회원탈퇴
        </button>
        {withdrawOpen && <WithdrawConfirmModal isOpen={setWithdrawOpen} onSuccess={() => router.push("/")} />}
      </div>
    </div>
  );
};

export default SideNav;
