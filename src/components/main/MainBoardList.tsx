"use client";
import { useMainRecentBoards } from "@/hooks/queries/useBoard";
import Error from "../common/error/Error";
import MainBoardListItem from "./items/MainBoardListItem";

const MainBoardList = () => {
  const { data: boards, isLoading, isError } = useMainRecentBoards();

  //스켈레톤 필요
  if (isLoading) return null;
  if (isError) return <Error />;

  return (
    <ul className="flex flex-wrap">
      {boards?.data.map((item) => (
        <MainBoardListItem key={item.id} item={item} />
      ))}
    </ul>
  );
};

export default MainBoardList;
