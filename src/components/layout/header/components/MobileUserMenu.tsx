import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";
import SignIn from "../../../auth/modal/SignIn";
import { SheetClose } from "@/components/ui/sheet";
import { useRecoilValue } from "recoil";
import { sessionState } from "@/store";

const MobileUserMenu = () => {
  const session = useRecoilValue(sessionState);

  return (
    <nav>
      <ul className="flex items-center justify-center">
        <li className="flex-1 hover:bg-zinc-500">
          <SheetClose asChild>
            <Link
              href="/cart"
              className="block border p-7 border-dark-gray group w-full h-[80px] border-r-0"
            >
              <IoCartOutline
                size={28}
                className="group-hover:[color:white] m-auto"
              />
            </Link>
          </SheetClose>
        </li>
        <li className="flex-1 hover:bg-zinc-500">
          {!session ? (
            <SignIn
              title="로그인"
              className="block w-full border p-7 border-dark-gray h-[80px] border-r-0 hover:text-white"
            />
          ) : (
            <SheetClose asChild>
              <Link
                href="/mypage"
                className="block text-center border h-[80px] p-7 border-dark-gray hover:text-white hover:bg-zinc-500 whitespace-nowrap"
              >
                마이페이지
              </Link>
            </SheetClose>
          )}
        </li>
        {!session && (
          <li className="flex-1">
            <SheetClose asChild>
              <Link
                href="/signup"
                className="block border p-7 h-[80px] border-dark-gray text-center hover:text-white hover:bg-zinc-500"
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
