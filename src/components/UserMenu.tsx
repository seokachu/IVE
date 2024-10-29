"use client";
import { IoCartOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import SignIn from "./auth/modal/SignIn";

const UserMenu = () => {
  const [isLogin] = useState(false);
  const { push } = useRouter();

  const onClickLogout = () => {
    push("/");
  };

  return (
    <nav>
      <ul className="flex gap-3 items-center">
        <li>
          <Link href="cart">
            <IoCartOutline className="cursor-pointer" size={24} />
          </Link>
        </li>
        <li>
          {!isLogin ? (
            // <Link href="/signup">로그인/회원가입</Link>
            <SignIn />
          ) : (
            // <button onClick={onClickLogout}>로그아웃</button>
            <Link href="/mypage">마이페이지</Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default UserMenu;
