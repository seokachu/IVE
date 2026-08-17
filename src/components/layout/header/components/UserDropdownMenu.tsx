import UserAvatar from "@/components/common/UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useState } from "react";
import LogoutConfirmModal from "@/components/common/modal/LogoutConfirmModal";
import MembershipBadge from "@/components/mypage/MembershipBadge";
import ProviderBadge, { getSigninProvider } from "@/components/auth/ProviderMark";
import { useMyMembership } from "@/hooks/queries/useMembership";
import { useSession } from "@/store/zustand";
import { getDisplayName } from "@/utils/userProfile";
import { Heart, LogOut, PencilLine, User } from "lucide-react";

//시안 기준: 프로필 로우(아바타·이름·이메일) + 아이콘 메뉴 + 로그아웃 분리
const MENU_ITEMS = [
  { label: "마이페이지", href: "/mypage", Icon: User },
  { label: "내가 쓴 글", href: "/mypage/posts", Icon: PencilLine },
  { label: "찜 목록", href: "/mypage/wishlist", Icon: Heart },
];

const UserDropdownMenu = () => {
  const session = useSession();
  const { tier } = useMyMembership();
  const signinProvider = getSigninProvider(session?.user);
  //모달은 드롭다운 밖에 렌더 — 메뉴가 닫히며 언마운트돼도 유지되도록
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <>
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="내 계정 메뉴">
        {/* 링은 UserAvatar가 티어에 맞춰 그린다 — 무료 없음 · DIVE+ 퍼플 · VIP 골드 */}
        <UserAvatar size="sm" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 rounded-2xl p-2 shadow-[0_12px_32px_rgba(10,10,10,0.12)]">
        <div className="flex items-center gap-2.5 p-2.5">
          <UserAvatar size="md" />
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-sm font-bold">
              <span className="truncate">{getDisplayName(session?.user)}</span>
              <MembershipBadge tier={tier} size="sm" />
            </p>
            <p className="flex items-center gap-1.5 text-[11px] text-gray-400">
              {/* 소셜 로그인 표시 — 일반 이메일 가입이면 아무것도 안 붙는다 */}
              {signinProvider && <ProviderBadge provider={signinProvider} />}
              <span className="truncate">{session?.user.email}</span>
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        {MENU_ITEMS.map(({ label, href, Icon }) => (
          <DropdownMenuItem key={href} asChild className="cursor-pointer rounded-[10px] px-2.5 py-2.5">
            <Link href={href} className="flex items-center gap-2 text-[13px] font-semibold">
              <Icon size={16} className="text-gray-500" aria-hidden />
              {label}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => setLogoutOpen(true)}
          className="cursor-pointer rounded-[10px] px-2.5 py-2.5 text-[13px] text-gray-500"
        >
          <LogOut size={16} className="text-gray-400" aria-hidden />
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    {logoutOpen && <LogoutConfirmModal isOpen={setLogoutOpen} />}
    </>
  );
};

export default UserDropdownMenu;
