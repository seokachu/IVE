import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserDefaultImage from "@/assets/images/profile_user.webp";

const UserAvatar = () => {
  return (
    <Avatar>
      <AvatarImage src={UserDefaultImage.src} alt="@shadcn" />
      <AvatarFallback>유저1</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
