import CartIcon from "./CartIcon";
import UserDropdownMenu from "./UserDropdownMenu";
import { useRecoilValue } from "recoil";
import { sessionState } from "@/store";
import SignInModal from "@/components/auth/modal/SignInModal";

const UserMenu = () => {
  const session = useRecoilValue(sessionState);

  return (
    <nav className="hidden lg:block">
      <ul className="flex gap-3 items-center">
        <li>
          <CartIcon className="left-3" />
        </li>
        <li>{!session ? <SignInModal /> : <UserDropdownMenu />}</li>
      </ul>
    </nav>
  );
};

export default UserMenu;
