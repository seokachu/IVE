import Link from "next/link";
import { useState } from "react";
import { IoCartOutline } from "react-icons/io5";
import SignIn from "./auth/modal/SignIn";
import { GoHeart } from "react-icons/go";

const MobileUserMenu = () => {
  const [isLogin] = useState(false);

  const onClickTest = () => {
    alert("클릭");
  };

  return (
    <nav>
      <ul className="flex items-center justify-center">
        <li className="flex-1 hover:bg-zinc-500">
          <Link
            href="/cart"
            className="block border p-7 border-dark-gray group w-full h-[80px] border-r-0"
          >
            <IoCartOutline
              size={28}
              className="group-hover:[color:white] m-auto"
            />
          </Link>
        </li>
        <li className="flex-1 hover:bg-zinc-500">
          {!isLogin ? (
            <SignIn
              title="로그인"
              className="block w-full border p-7 border-dark-gray h-[80px] border-r-0 hover:text-white"
            />
          ) : (
            <button
              onClick={onClickTest}
              className="block w-full border p-7 h-[80px] border-dark-gray group border-r-0"
            >
              <GoHeart size={28} className="group-hover:[color:white] m-auto" />
            </button>
          )}
        </li>
        <li className="flex-1">
          {!isLogin ? (
            <Link
              href="/signup"
              className="block border p-7 h-[80px] border-dark-gray text-center hover:text-white hover:bg-zinc-500"
            >
              회원가입
            </Link>
          ) : (
            <Link
              href="/mypage"
              className="block border h-[80px] p-7 border-dark-gray hover:text-white hover:bg-zinc-500 whitespace-nowrap"
            >
              마이페이지
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default MobileUserMenu;
