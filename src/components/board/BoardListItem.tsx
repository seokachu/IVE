import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/formatDate";
import type { BoardListItemProps } from "@/types";

const BoardListItem = ({ item }: BoardListItemProps) => {
  const { push } = useRouter();

  const onClickBoardDetail = () => {
    push(`/board/${item.id}`);
  };

  return (
    <li
      onClick={onClickBoardDetail}
      className="px-1 text-center flex text-sm lg:text-base py-3 border-b hover:bg-gray-50 cursor-pointer"
    >
      <p className="w-[10%] text-gray-500">{item.id}</p>
      <div className="w-[50%] lg:w-[40%] text-left flex gap-1 px-3">
        <p className="text-left max-w-[80%] truncate">{item.title}</p>
        <p className="text-blue-500">
          &#91;{item.board_comments.count || 0}&#93;
        </p>
      </div>
      <h3 className="w-[20%] text-left shrink-0">{item.user.name}</h3>
      <time className="w-[20%] text-gray-500">
        {formatDate(item.created_at, "dash")}
      </time>
      <p className="w-[10%] text-gray-500 hidden lg:block">{item.views || 0}</p>
    </li>
  );
};

export default BoardListItem;
