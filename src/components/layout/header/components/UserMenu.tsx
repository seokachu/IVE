import CartIcon from "./CartIcon";
import UserDropdownMenu from "./UserDropdownMenu";
import { useRecoilValue } from "recoil";
import { sessionState } from "@/store";
import SignInModal from "@/components/auth/modal/SignInModal";

const UserMenu = () => {
  const session = useRecoilValue(sessionState);

  return (
    <nav className="hidden lg:block">
      <ul className="flex gap-4 items-center">
        <li className={`${!session ? "translate-y-0" : "translate-y-[2px]"} `}>
          <CartIcon className="left-3" />
        </li>
        <li className="flex">
          {!session ? <SignInModal /> : <UserDropdownMenu />}
        </li>
      </ul>
    </nav>
  );
};

export default UserMenu;
