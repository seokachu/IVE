import UserAvatar from "@/components/common/UserAvatar";
import { formatDate } from "@/utils/formatDate";
import RenderStars from "@/utils/RenderStars";
import type { ReviewItemProps } from "@/types/shop";

const ReviewItem = ({ item }: ReviewItemProps) => {
  const userName = item.user?.name || "익명";

  return (
    <li className="border-b py-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* 소셜 로그인은 프로필 이미지가 user 테이블이 아니라 auth 메타데이터에 있다 —
              UserAvatar가 본인 세션이면 메타데이터에서 읽고, 없으면 이니셜 서클로 폴백한다 (댓글과 동일 규칙) */}
          <UserAvatar
            userId={item.user_id}
            avatarUrl={item.user?.avatar_url}
            userName={item.user?.name}
            size="md"
            className="shrink-0 border-gray-200"
          />
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold">{userName}</h3>
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
