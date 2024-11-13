import { IoCartOutline } from "react-icons/io5";
import Link from "next/link";
import SignIn from "../../../auth/modal/SignIn";
import UserDropdownMenu from "./UserDropdownMenu";
import { useRecoilValue } from "recoil";
import { loadingState, sessionState } from "@/store";
import LoadingSkeleton from "@/components/common/loading/LoadingSkeleton";

const UserMenu = () => {
  const session = useRecoilValue(sessionState);
  const loading = useRecoilValue(loadingState);

  if (loading) {
  }

  return (
    <nav className="hidden lg:block">
      <ul className="flex gap-3 items-center">
        <li>
          <Link href="/cart">
            <IoCartOutline className="cursor-pointer" size={24} />
          </Link>
        </li>
        <li>
          {loading ? (
            <LoadingSkeleton />
          ) : !session ? (
            <SignIn />
          ) : (
            <UserDropdownMenu />
          )}
        </li>
      </ul>
    </nav>
  );
};

export default UserMenu;
