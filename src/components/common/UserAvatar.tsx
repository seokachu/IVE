import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRecoilValue } from "recoil";
import { sessionState } from "@/store";

interface AvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
}

const UserAvatar = ({ size = "md" }: AvatarProps) => {
  const session = useRecoilValue(sessionState);

  const avatarUrl = session?.user.user_metadata.avatar_url;

  const sizeStyles = {
    sm: "w-[30px] h-[30px]",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  return (
    <Avatar className={`border ${sizeStyles[size]}`}>
      <AvatarImage
        src={avatarUrl}
        alt={session?.user.user_metadata.avatar_url || "유저 프로필"}
        key={avatarUrl}
      />
      <AvatarFallback className={`text-xs ${sizeStyles[size]}`}>
        {session?.user.user_metadata.name || "사용자"}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
