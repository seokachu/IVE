import BoardListItem from "./BoardListItem";
import type { BoardListProps } from "@/types";

const BoardList = ({ boards }: BoardListProps) => {
  return (
    <ul>
      {boards?.data?.map((item) => (
        <BoardListItem key={item.id} item={item} />
      ))}
    </ul>
  );
};

export default BoardList;
