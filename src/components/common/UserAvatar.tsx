import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRecoilValue } from "recoil";
import { sessionState } from "@/store";

interface AvatarProps {
  size?: "sm" | "md" | "lg";
}

const UserAvatar = ({ size = "md" }: AvatarProps) => {
  const session = useRecoilValue(sessionState);

  const sizeStyles = {
    sm: "w-[35px] h-auto",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const avatarUrl = session?.user.user_metadata.avatar_url;

  return (
    <Avatar className={sizeStyles[size]}>
      <AvatarImage
        src={avatarUrl}
        alt={session?.user.user_metadata.avatar_url || "유저 프로필"}
      />
      <AvatarFallback className="text-xs">
        {session?.user.user_metadata.name || "사용자"}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
