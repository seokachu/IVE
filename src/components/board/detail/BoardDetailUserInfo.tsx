import UserAvatar from "@/components/common/UserAvatar";
import type { BoardDetailProps } from "@/types";

const BoardDetailUserInfo = ({ item }: BoardDetailProps) => {
  return (
    <div className="flex bg-gray-100 rounded-md py-3 px-2 lg:px-5">
      <div className="flex gap-2 items-center">
        <h3 className="relative w-[40px] h-auto overflow-hidden">
          <UserAvatar
            size="md"
            userId={item.user_id}
            avatarUrl={item.user.avatar_url}
            userName={item.user.name}
          />
        </h3>
        <h2 className="text-sm">{item?.user?.name}</h2>
      </div>
    </div>
  );
};

export default BoardDetailUserInfo;
