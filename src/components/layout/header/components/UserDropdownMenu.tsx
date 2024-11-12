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
import { signOut } from "@/lib/supabase/auth";

const UserDropdownMenu = () => {
  const session = useRecoilValue(sessionState);

  console.log(session);

  const onClickSignOut = async () => {
    await signOut();
    alert("로그아웃 완료");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar size="sm" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          {session?.user?.user_metadata?.name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/mypage">마이페이지</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-dark-gray text-xs cursor-pointer">
          <button onClick={onClickSignOut}>로그아웃</button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdownMenu;
