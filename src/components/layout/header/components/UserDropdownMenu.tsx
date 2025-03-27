import UserAvatar from "@/components/common/UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRecoilValue } from "recoil";
import { sessionState } from "@/store";
import SignOutButton from "@/components/common/button/SignOutButton";

const UserDropdownMenu = () => {
  const session = useRecoilValue(sessionState);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar size="sm" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{session?.user.user_metadata?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/mypage">마이페이지</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-dark-gray text-xs cursor-pointer">
          <SignOutButton className="w-full text-left" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdownMenu;
