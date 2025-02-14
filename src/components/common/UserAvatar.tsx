import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRecoilValue } from "recoil";
import { sessionState } from "@/store";

interface AvatarProps {
  userId?: string | null;
  avatarUrl?: string | null;
  userName?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const UserAvatar = ({
  userId,
  avatarUrl,
  userName,
  size = "md",
  className,
}: AvatarProps) => {
  const session = useRecoilValue(sessionState);

  const getUserImage = () => {
    if (!userId) return session?.user.user_metadata.avatar_url;
    if (session?.user.id === userId)
      return session?.user.user_metadata.avatar_url;
    return avatarUrl || undefined;
  };

  const getUserName = () => {
    if (!userId) return session?.user.user_metadata.name;
    if (session?.user.id === userId) return session?.user.user_metadata.name;
    return userName || undefined;
  };

  const imageUrl = getUserImage();
  const displayName = getUserName();

  const sizeStyles = {
    xs: "w-[25px] h-[25px]",
    sm: "w-[30px] h-[30px]",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  return (
    <Avatar className={`border ${sizeStyles[size]} ${className || ""}`}>
      <AvatarImage
        src={imageUrl}
        alt={displayName || "유저 프로필"}
        key={avatarUrl}
      />
      <AvatarFallback className={`text-xs ${sizeStyles[size]}`}>
        {displayName || "유저 프로필"}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
