import Link from "next/link";
import SignInModal from "../../../auth/modal/SignInModal";
import { SheetClose } from "@/components/ui/sheet";
import { useRecoilValue } from "recoil";
import { sessionState } from "@/store";
import CartIcon from "./CartIcon";

const MobileUserMenu = () => {
  const session = useRecoilValue(sessionState);
  const navListStyle =
    "flex-1 hover:bg-zinc-400 h-full w-2/6 block border border-dark-gray group";

  const hoverStyle = "group-hover:[color:white]";
  const navListItemStyle = "w-full h-full flex items-center justify-center";

  return (
    <nav>
      <ul className="flex items-center justify-center w-full h-[80px]">
        <li className={`${navListStyle} border-r-0`}>
          <SheetClose asChild>
            <Link href="/cart" className={`${navListItemStyle}`}>
              <CartIcon
                iconSize={28}
                iconClassName="group-hover:[color:white] m-auto"
                className="left-2/4"
              />
            </Link>
          </SheetClose>
        </li>
        <li className={`${navListStyle} border-r-0`}>
          {!session ? (
            <SignInModal
              title="로그인"
              className={`${hoverStyle} w-full h-full`}
            />
          ) : (
            <SheetClose asChild>
              <Link
                href="/mypage"
                className={`${navListItemStyle} ${hoverStyle}`}
              >
                마이페이지
              </Link>
            </SheetClose>
          )}
        </li>
        {!session && (
          <li className={`${navListStyle}`}>
            <SheetClose asChild>
              <Link
                href="/signup"
                className={`${navListItemStyle} ${hoverStyle}`}
              >
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
