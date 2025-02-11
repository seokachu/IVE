import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/formatDate";
import type { BoardListItemProps } from "@/types";
import ActionButton from "../common/button/ActionButton";

const BoardListItem = ({ item }: BoardListItemProps) => {
  const { push } = useRouter();

  const onClickBoardDetail = () => {
    push(`/board/${item.id}`);
  };

  return (
    <>
      <li
        onClick={onClickBoardDetail}
        className="cursor-pointer first:border-t lg:first:border-t-0"
      >
        {/* Desktop */}
        <div className="hidden lg:flex text-center py-3 border-b hover:bg-gray-50">
          <p className="w-[10%] text-gray-500">{item.id}</p>
          <div className="w-[40%] text-left flex gap-1">
            <p className="text-left max-w-[80%] truncate">{item.title}</p>
            <p className="text-blue-500">
              &#91;{item.board_comments[0]?.count || 0}&#93;
            </p>
          </div>
          <h3 className="w-[15%] text-left pl-3">{item.user.name}</h3>
          <time className="w-[15%] text-gray-500">
            {formatDate(item.created_at, "dash")}
          </time>
          <p className="w-[10%] text-gray-500">{item.views || 0}</p>
          <p className="w-[10%] text-gray-500">
            {item.board_likes[0]?.count || 0}
          </p>
        </div>
        {/* Mobile */}
        <div className="lg:hidden text-center py-3 px-5 border-b hover:bg-gray-50">
          <div className="flex items-center justify-between gap-5">
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <p className="w-full truncate text-left">{item.title}</p>
              <div className="text-gray-500 text-xs flex gap-2">
                <h3 className="shrink-0">{item.user.name}</h3>
                <p className="shrink-0">조회 {item.views || 0}</p>
                <p className="shrink-0">
                  추천 {item.board_likes[0]?.count || 0}
                </p>
                <time className="shrink-0">
                  {formatDate(item.created_at, "dash")}
                </time>
              </div>
            </div>
            <ActionButton
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
      </li>
    </>
  );
};

export default BoardListItem;
