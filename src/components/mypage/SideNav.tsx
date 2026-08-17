"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import _ from "lodash";
import { Crown, FileText, Heart, MapPin, ShoppingBag, type LucideIcon } from "lucide-react";
import PushSettingRow from "@/components/mypage/PushSettingRow";
import { MYPAGE_GNB_ARRAY } from "@/utils/constants";
import { useWishLists } from "@/hooks/queries/useWishList";
import { useMyBoards } from "@/hooks/queries/useBoard";
import { useOrderItems } from "@/hooks/queries/useOrderItems";
import { useShippingAddresses } from "@/hooks/queries/useShippingAddress";
import useSignOut from "@/hooks/useSignOut";
import { toast } from "@/hooks/use-toast";
import { useSession } from "@/store/zustand";
import { cn } from "@/utils/utils";

const NAV_ICONS: Record<string, LucideIcon> = {
  membership: Crown,
  wishlist: Heart,
  orders: ShoppingBag,
  posts: FileText,
  address: MapPin,
};

//마이페이지 사이드 내비 — 아이콘·카운트·활성 필 + 푸시 알림 카드 + 계정 링크 (.pen 시안의 SideNav)
const SideNav = () => {
  const session = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const { handleSignOut } = useSignOut(() => router.push("/"));
  const { data: wishlists } = useWishLists(session?.user.id);
  const { data: myBoards } = useMyBoards(session?.user.id);
  const { data: orderItems } = useOrderItems(session?.user.id);
  const { data: addresses } = useShippingAddresses(session?.user.id);

  const counts: Record<string, number | null> = {
    membership: null,
    wishlist: wishlists?.length ?? 0,
    orders: Object.keys(_.groupBy(orderItems || [], "order_id")).length,
    posts: myBoards?.length ?? 0,
    address: addresses?.length ?? 0,
  };

  const isActivePath = (path: string, exact: boolean) => (exact ? pathname === path : pathname.startsWith(path));

  const onClickWithdraw = () => {
    toast({ title: "회원탈퇴는 준비 중이에요.", description: "필요하시면 문의로 요청해주세요." });
  };

  return (
    <nav className="flex flex-col gap-5" aria-label="마이페이지 메뉴">
      <ul className="flex flex-row gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {MYPAGE_GNB_ARRAY.map((menu) => {
          const Icon = NAV_ICONS[menu.key];
          const active = isActivePath(menu.path, menu.exact);
          const count = counts[menu.key];

          return (
            <li key={menu.key} className="shrink-0 lg:shrink">
              <Link
                href={menu.path}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-lg px-3.5 py-3 transition-colors",
                  active ? "bg-purple-50 dark:bg-purple-50" : "hover:bg-gray-50",
                )}
              >
                <span className="flex items-center gap-2.5">
                  <Icon
                    size={18}
                    className={active ? "text-purple-500 dark:text-purple-300" : "text-gray-400"}
                    aria-hidden="true"
                  />
                  <span
                    className={cn(
                      "text-sm",
                      active ? "font-semibold text-purple-500 dark:text-purple-300" : "text-gray-500",
                    )}
                  >
                    {menu.label}
                  </span>
                </span>
                {menu.isNew ? (
                  <span className="text-[10px] font-bold text-orange-500">NEW</span>
                ) : (
                  <span
                    className={cn(
                      "text-[13px]",
                      active ? "font-bold text-purple-400" : "text-gray-400",
                    )}
                  >
                    {count}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
      <hr className="hidden border-gray-200 lg:block" />
      <PushSettingRow />
      <div className="flex items-center gap-3 px-3.5 pb-2 text-[13px]">
        <button type="button" onClick={handleSignOut} className="text-gray-500 hover:text-purple-500 transition-colors">
          로그아웃
        </button>
        <span className="h-2.5 w-px bg-gray-200" aria-hidden="true" />
        <button type="button" onClick={onClickWithdraw} className="text-gray-300 hover:text-gray-400 transition-colors">
          회원탈퇴
        </button>
      </div>
    </nav>
  );
};

export default SideNav;
