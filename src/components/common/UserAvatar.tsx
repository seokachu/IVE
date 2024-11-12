import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserDefaultImage from "@/assets/images/profile_user.webp";
import { useRecoilValue } from "recoil";
import { sessionState } from "@/store";

const UserAvatar = () => {
  const session = useRecoilValue(sessionState);

  return (
    <Avatar>
      <AvatarImage
        src={session?.user?.user_metadata?.avatar_url}
        alt="@shadcn"
      />
      <AvatarFallback>user</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
