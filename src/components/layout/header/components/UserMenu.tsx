import { IoCartOutline } from "react-icons/io5";
import Link from "next/link";
import SignIn from "../../../auth/modal/SignIn";
import UserDropdownMenu from "./UserDropdownMenu";
import { useRecoilValue } from "recoil";
import { sessionState } from "@/store";

const UserMenu = () => {
  const session = useRecoilValue(sessionState);

  return (
    <nav className="hidden lg:block">
      <ul className="flex gap-3 items-center">
        <li>
          <Link href="/cart">
            <IoCartOutline className="cursor-pointer" size={24} />
          </Link>
        </li>
        <li>{!session ? <SignIn /> : <UserDropdownMenu />}</li>
      </ul>
    </nav>
  );
};

export default UserMenu;
