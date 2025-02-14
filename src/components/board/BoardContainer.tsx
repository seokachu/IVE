"use client";
import ActionButton from "@/components/common/button/ActionButton";
import Search from "@/components/common/search/Search";
import BoardListHeader from "@/components/board/BoardListHeader";
import { GoPlusCircle } from "react-icons/go";
import BoardList from "./BoardList";
import { useRouter } from "next/navigation";
import { useBoards } from "@/hooks/queries/useBoard";
import { useState } from "react";
import PaginationControl from "@/components/common/PaginationControl";
import Error from "../common/error/Error";
import BoardSkeleton from "../common/loading/BoardSkeleton";
import { PAGINATION } from "@/utils/constants";

const BoardContainer = () => {
  const { push } = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const { data: boardList, isLoading, isError } = useBoards(currentPage);

  const totalPages = Math.ceil(
    (boardList?.count || 0) / PAGINATION.BOARD.ITEMS_PER_PAGE
  );

  if (isLoading) return <BoardSkeleton />;
  if (isError) return <Error />;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const onClickBoardWrite = () => {
    push("board/write");
  };

  return (
    <>
      <div className="lg:flex justify-between items-center px-5 lg:px-0">
        <h2 className="text-lg lg:text-xl font-bold mb-5 lg:mb-0">
          자유게시판
        </h2>
        <div className="flex items-center justify-end gap-3 flex-col lg:flex-row lg:w-2/3">
          <div className="relative w-full lg:max-w-80">
            <Search
              className="pl-10 pr-4 py-2 border rounded-md"
              placeholder="검색어를 입력하세요."
              iconClassName="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
          <ActionButton
            onClick={onClickBoardWrite}
            variant="primary"
            className="flex items-center justify-center border-1 lg:border-2 gap-2 px-4 py-2 w-full lg:w-28 text-base lg:text-sm"
          >
            <GoPlusCircle className="w-5 h-5 translate-y-[1px]" />
            <span>글쓰기</span>
          </ActionButton>
        </div>
      </div>
      <div className="mt-5 lg:mt-10 min-h-auto lg:shadow rounded-md overflow-hidden">
        <BoardListHeader />
        <BoardList boards={boardList} />
      </div>
      {totalPages > 1 && (
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          maxDisplayPages={PAGINATION.BOARD.MAX_DISPLAY_PAGES}
        />
      )}
    </>
  );
};

export default BoardContainer;
