"use client";
import { useMainRecentBoards } from "@/hooks/queries/useBoard";
import Error from "../common/error/Error";
import MainBoardListItem from "./items/MainBoardListItem";
import MainBoardListSkeleton from "../common/loading/MainBoardListSkeleton";

const MainBoardList = () => {
  const { data: boards, isLoading, isError } = useMainRecentBoards();

  if (isLoading) {
    return (
      <ul className="flex flex-wrap">
        {Array.from({ length: 6 }).map((_, index) => (
          <MainBoardListSkeleton key={index} />
        ))}
      </ul>
    );
  }

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
