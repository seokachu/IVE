import Link from "next/link";
import LoginLink from "@/components/auth/login/LoginLink";
import { SheetClose } from "@/components/ui/sheet";
import CartIcon from "./CartIcon";
import { useSession } from "@/store/zustand";

const MobileUserMenu = () => {
  const session = useSession();
  const navListStyle = "flex-1 hover:bg-gray-400 h-full w-2/6 block border border-gray-300 group";

  const hoverStyle = "group-hover:[color:white]";
  const navListItemStyle = "w-full h-full flex items-center justify-center";

  return (
    <nav>
      <ul className="flex items-center justify-center w-full h-[80px]">
        <li className={`${navListStyle} border-r-0`}>
          <SheetClose asChild>
            <Link href="/cart" className={`${navListItemStyle}`}>
              <CartIcon iconSize={28} iconClassName="group-hover:[color:white]" />
            </Link>
          </SheetClose>
        </li>
        <li className={`${navListStyle} border-r-0`}>
          {!session ? (
            <SheetClose asChild>
              <LoginLink className={`${navListItemStyle} ${hoverStyle}`}>로그인</LoginLink>
            </SheetClose>
          ) : (
            <SheetClose asChild>
              <Link href="/mypage" className={`${navListItemStyle} ${hoverStyle}`}>
                마이페이지
              </Link>
            </SheetClose>
          )}
        </li>
        {!session && (
          <li className={`${navListStyle}`}>
            <SheetClose asChild>
              <Link href="/signup" className={`${navListItemStyle} ${hoverStyle}`}>
                회원가입
              </Link>
            </SheetClose>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default MobileUserMenu;
