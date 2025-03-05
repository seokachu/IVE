import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/formatDate";
import ActionButton from "@/components/common/button/ActionButton";
import { useIncrementViewCount } from "@/hooks/queries/useBoard";
import { hasViewedPost, markPostAsViewed } from "@/utils/viewCount";
import UserAvatar from "@/components/common/UserAvatar";
import type { BoardListItemProps } from "@/types";

const BoardListItem = ({ item, keyword }: BoardListItemProps) => {
  const { push } = useRouter();

  const incrementViewCount = useIncrementViewCount();

  const onClickBoardDetail = () => {
    if (!hasViewedPost(item.id)) {
      incrementViewCount.mutate(item.id);
      markPostAsViewed(item.id);
    }
    push(`/board/${item.id}`);
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const onClickCommentDetail = () => {
    if (!hasViewedPost(item.id)) {
      incrementViewCount.mutate(item.id);
      markPostAsViewed(item.id);
    }

    push(`/board/${item.id}#comments`);
  };

  //검색어 하이라이트 처리
  const highlightKeyword = (title: string | null, keyword: string) => {
    if (!title || !keyword || keyword === "") return title;

    const escapeRegExp = (text: string) => {
      return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    };

    const regex = new RegExp(`(${escapeRegExp(keyword)})`, "gi");
    const word = title.split(regex);

    return word.map((text, index) => {
      if (text.toLowerCase() === keyword.toLowerCase()) {
        return (
          <span key={index} className="bg-yellow-200">
            {text}
          </span>
        );
      }
      return text;
    });
  };

  return (
    <li
      onClick={onClickBoardDetail}
      className="cursor-pointer first:border-t lg:first:border-t-0 lg:h-[50px] border-b"
    >
      {/* Desktop */}
      <div className="hidden lg:flex text-center py-3 hover:bg-gray-50 items-center">
        <p className="w-[10%] text-gray-500">{item.id}</p>
        <div className="w-[40%] text-left flex gap-1">
          <p className="text-left max-w-[80%] truncate">
            {highlightKeyword(item.title, keyword || "")}
          </p>
          <p className="text-blue-500">
            &#91;{item.board_comments[0]?.count || 0}&#93;
          </p>
        </div>
        <h3 className="w-[15%] text-left pl-3 flex items-center gap-1">
          {item.user.avatar_url && (
            <UserAvatar
              size="xs"
              userId={item.user_id}
              userName={item.user.name}
              avatarUrl={item.user.avatar_url}
            />
          )}
          <span>{item.user.name}</span>
        </h3>
        <time className="w-[15%] text-gray-500">
          {formatDate(item.created_at, "dash")}
        </time>
        <p className="w-[10%] text-gray-500">{item.views || 0}</p>
        <p className="w-[10%] text-gray-500">
          {item.board_likes[0]?.count || 0}
        </p>
      </div>
      {/* Mobile */}
      <div className="lg:hidden text-center py-3 px-5 hover:bg-gray-50">
        <div className="flex items-center justify-between gap-5">
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <p className="w-full truncate text-left">
              {highlightKeyword(item.title, keyword || "")}
            </p>
            <div className="text-gray-500 text-xs flex gap-2 items-center">
              <h3 className="shrink-0 flex items-center gap-[2px]">
                {item.user.avatar_url && (
                  <UserAvatar
                    userId={item.user_id}
                    userName={item.user.name}
                    avatarUrl={item.user.avatar_url}
                    className="w-[20px] h-[20px]"
                  />
                )}
                <span>{item.user.name}</span>
              </h3>
              <p className="shrink-0">조회 {item.views || 0}</p>
              <p className="shrink-0">추천 {item.board_likes[0]?.count || 0}</p>
              <time className="shrink-0">
                {formatDate(item.created_at, "dash")}
              </time>
            </div>
          </div>
          <div onClick={stopPropagation}>
            <ActionButton
              onClick={onClickCommentDetail}
              variant="default"
              className="px-3 py-2 flex flex-col items-center gap-1 bg-white group"
            >
              <strong className="font-bold">
                {item.board_comments[0]?.count || 0}
              </strong>
              <span className="text-xs text-gray-500 group-hover:text-purple">
                댓글
              </span>
            </ActionButton>
          </div>
        </div>
      </div>
    </li>
  );
};

export default BoardListItem;
