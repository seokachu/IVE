import { IoCartOutline } from "react-icons/io5";
import { useState } from "react";
import Link from "next/link";
import SignIn from "./auth/modal/SignIn";

const UserMenu = () => {
  const [isLogin] = useState(false);

  return (
    <nav className="hidden lg:block">
      <ul className="flex gap-3 items-center">
        <li>
          <Link href="/cart">
            <IoCartOutline className="cursor-pointer" size={24} />
          </Link>
        </li>
        <li>
          {!isLogin ? <SignIn /> : <Link href="/mypage">마이페이지</Link>}
        </li>
      </ul>
    </nav>
  );
};

export default UserMenu;
