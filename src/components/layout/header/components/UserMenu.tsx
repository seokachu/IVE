import CartIcon from "./CartIcon";
import UserDropdownMenu from "./UserDropdownMenu";
import LoginLink from "@/components/auth/login/LoginLink";
import Link from "next/link";
import { useSession } from "@/store/zustand";

const UserMenu = () => {
  const session = useSession();

  return (
    <nav className="hidden lg:block">
      <ul className="flex gap-4 items-center">
        {/* 정렬은 ul items-center로 통일 — 세션별 translate 보정 제거 */}
        <li className="flex items-center">
          <Link href="/cart" aria-label="장바구니">
            <CartIcon iconSize={19} />
          </Link>
        </li>
        <li className="flex">
          {!session ? (
            <LoginLink className="px-5 py-2 rounded-full bg-purple text-white text-sm font-semibold hover:opacity-90 transition-opacity">
              로그인
            </LoginLink>
          ) : (
            <UserDropdownMenu />
          )}
        </li>
      </ul>
    </nav>
  );
};

export default UserMenu;
