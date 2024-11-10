"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserDefaultImage from "@/assets/images/profile_user.webp";

const UserAvatar = () => {
  const userSelectOption = [
    { value: "마이페이지", path: "/mypage" },
    { value: "로그아웃" },
  ];

  const onClickUserMenu = () => {
    alert("클릭");
  };

  return (
    <Avatar onClick={onClickUserMenu} className="cursor-pointer">
      <AvatarImage src={UserDefaultImage.src} alt="@shadcn" />
      <AvatarFallback>유저1</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
