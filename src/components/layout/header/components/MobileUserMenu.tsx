import Link from "next/link";
import SignInModal from "../../../auth/modal/SignInModal";
import { SheetClose } from "@/components/ui/sheet";
import { useRecoilValue } from "recoil";
import { sessionState } from "@/store";
import CartIcon from "./CartIcon";

const MobileUserMenu = () => {
  const session = useRecoilValue(sessionState);
  const navStyle =
    "flex-1 hover:bg-zinc-500 h-full w-2/6 block border border-dark-gray";

  return (
    <nav>
      <ul className="flex items-center justify-center w-full h-[80px]">
        <li
          className={`${navStyle} border-r-0 flex items-center justify-center`}
        >
          <SheetClose asChild>
            <Link href="/cart">
              <CartIcon
                iconSize={28}
                iconClassName="group-hover:[color:white] m-auto"
                linkClassName=""
                className="left-2/4"
              />
            </Link>
          </SheetClose>
        </li>
        <li
          className={`${navStyle} border-r-0 flex items-center justify-center whitespace-nowrap`}
        >
          {!session ? (
            <SignInModal title="로그인" />
          ) : (
            <SheetClose asChild>
              <Link href="/mypage">마이페이지</Link>
            </SheetClose>
          )}
        </li>
        {!session && (
          <li
            className={`${navStyle} flex items-center justify-center whitespace-nowrap`}
          >
            <SheetClose asChild>
              <Link href="/signup">회원가입</Link>
            </SheetClose>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default MobileUserMenu;
