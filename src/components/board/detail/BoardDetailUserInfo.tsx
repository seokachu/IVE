import UserAvatar from "@/components/common/UserAvatar";
import MoreLink from "@/components/common/MoreLink";
import { useAuthorPostCount } from "@/hooks/queries/useBoard";
import type { BoardDetailProps } from "@/types/board";

//작성자 카드 — 글 수와 함께 작성자의 다른 글로 이어지는 회유 동선
const BoardDetailUserInfo = ({ item }: BoardDetailProps) => {
  const { data: postCount } = useAuthorPostCount(item.user_id);

  return (
    <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-5 py-4">
      <UserAvatar
        size="lg"
        userId={item.user_id}
        avatarUrl={item.user?.avatar_url}
        userName={item.user?.name}
      />
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <span className="text-[15px] font-bold truncate">{item?.user?.name}</span>
        <span className="text-xs text-gray-500">
          라운지에 남긴 글 {postCount ?? "-"}개
        </span>
      </div>
      <div className="shrink-0">
        <MoreLink href={`/board?author=${item.user_id}`} label="이 다이브의 다른 글" />
      </div>
    </div>
  );
};

export default BoardDetailUserInfo;
