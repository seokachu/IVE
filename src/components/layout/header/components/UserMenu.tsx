import { IoCartOutline } from "react-icons/io5";
import { useState } from "react";
import Link from "next/link";
import SignIn from "../../../auth/modal/SignIn";
import UserDropdownMenu from "./UserDropdownMenu";

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
        <li>{isLogin ? <SignIn /> : <UserDropdownMenu />}</li>
      </ul>
    </nav>
  );
};

export default UserMenu;
