import { useBoards } from "@/hooks/queries/useBoard";
import BoardListItem from "./BoardListItem";

const BoardList = () => {
  const { data: boardList, isLoading, isError } = useBoards();

  if (isLoading) return null;
  if (isError) return null;

  return (
    <ul>
      {boardList?.map((item) => (
        <BoardListItem key={item.id} item={item} />
      ))}
    </ul>
  );
};

export default BoardList;
