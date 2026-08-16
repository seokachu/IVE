import BoardListItem from "./BoardListItem";
import type { BoardListProps } from "@/types/board";

const BoardList = ({ boards, keyword }: BoardListProps) => {
  return (
    <ul data-testid="board-list" className="divide-y divide-gray-200">
      {boards?.data?.map((item) => (
        <BoardListItem key={item.id} item={item} keyword={keyword} />
      ))}
    </ul>
  );
};

export default BoardList;
