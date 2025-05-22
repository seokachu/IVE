import ActionButton from "@/components/common/button/ActionButton";
import UserAvatar from "@/components/common/UserAvatar";
import { formatDate } from "@/utils/formatDate";
import { useRouter } from "next/navigation";
import type { PostListItemProps } from "@/types/mypage";

const PostListItem = ({ item }: PostListItemProps) => {
  const { push } = useRouter();

  const onClickBoardDetail = () => {
    push(`/board/${item.id}`);
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const onClickCommentDetail = () => {
    push(`/board/${item.id}#comments`);
  };

  return (
    <li
      onClick={onClickBoardDetail}
      className="cursor-pointer text-center border rounded-sm py-3 lg:py-4 px-3 lg:px-6 hover:bg-gray-50"
    >
      <div className="flex items-center justify-between gap-5">
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <p className="w-full truncate text-left">{item.title}</p>
          <div className="text-gray-500 text-xs flex gap-2 items-center">
            <h3 className="shrink-0 flex items-center gap-[2px]">
              <UserAvatar
                userId={item.user_id}
                userName={item.user.name}
                avatarUrl={item.user.avatar_url}
                className="w-[20px] h-[20px]"
              />
              <span>{item.user.name}</span>
            </h3>
            <p className="shrink-0">조회 {item.views}</p>
            <p className="shrink-0">추천 {item.board_likes[0]?.count || 0}</p>
            <time className="shrink-0">{formatDate(item.created_at, "dash")}</time>
          </div>
        </div>
        <div onClick={stopPropagation}>
          <ActionButton
            onClick={onClickCommentDetail}
            variant="default" 
            className="px-3 py-2 flex flex-col items-center gap-1 bg-white group"
          >
            <strong className="font-bold">{item.board_comments[0]?.count || 0}</strong>
            <span className="text-xs text-gray-500 group-hover:text-purple">댓글</span>
          </ActionButton>
        </div>
      </div>
    </li>
  );
};

export default PostListItem;
