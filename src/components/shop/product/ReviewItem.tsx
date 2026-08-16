import { formatDate } from "@/utils/formatDate";
import UserAvatar from "@/components/common/UserAvatar";
import RenderStars from "@/utils/RenderStars";
import type { ReviewItemProps } from "@/types/shop";

const ReviewItem = ({ item }: ReviewItemProps) => {
  return (
    <li className="border-b py-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <UserAvatar size="md" userId={item.user_id} avatarUrl={item.user.avatar_url} userName={item.user.name} />
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold">{item.user.name}</h3>
            <div className="flex items-center gap-1">
              <div className="flex gap-0.5">
                <RenderStars rating={item.rating} size={12} />
              </div>
              <strong className="text-xs text-gray-500">{item.rating}.0</strong>
            </div>
          </div>
        </div>
        <time className="text-xs text-gray-400">{formatDate(item.created_at)}</time>
      </div>
      <p className="mt-3 pl-[52px] text-sm leading-relaxed text-gray-500">{item.content}</p>
    </li>
  );
};

export default ReviewItem;
