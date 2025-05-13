"use client";
import BoardListHeader from "@/components/board/BoardListHeader";
import BoardList from "./BoardList";
import { useRouter, useSearchParams } from "next/navigation";
import { useBoards } from "@/hooks/queries/useBoard";
import { useEffect, useRef, useState } from "react";
import PaginationControl from "@/components/common/PaginationControl";
import Error from "@/components/common/error/Error";
import BoardSkeleton from "@/components/common/loading/BoardSkeleton";
import { PAGINATION } from "@/utils/constants";
import useAuthGuard from "@/hooks/useAuthGuard";
import SearchLoading from "../common/loading/SearchLoading";
import { TbMoodEmpty } from "react-icons/tb";
import BoardActions from "./BoardActions";

const BoardContainer = () => {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const isFirstLoad = useRef(true);
  const [searchKeyWord, setSearchKeyWord] = useState(
    searchParams.get("search") || ""
  );
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1", 10)
  );
  const {
    data: boardList,
    isLoading,
    isError,
  } = useBoards(currentPage, searchKeyWord);
  const { checkAuth } = useAuthGuard();

  useEffect(() => {
    if (!isLoading) {
      isFirstLoad.current = false;
    }
  }, [isLoading]);

  const totalPages = Math.ceil(
    (boardList?.count || 0) / PAGINATION.BOARD.ITEMS_PER_PAGE
  );

  if (isLoading && isFirstLoad.current) return <BoardSkeleton />;
  if (isError) return <Error />;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());

    if (searchKeyWord) {
      params.set("search", searchKeyWord);
    }

    push(`/board?${params.toString()}`);
  };

  const handleSearch = (value: string) => {
    setSearchKeyWord(value);
    setCurrentPage(1);
  };

  const onClickBoardWrite = () => {
    if (!checkAuth()) return;
    push("board/write");
  };

  //검색 내용 보여주는 함수
  const renderBoardContent = () => {
    //검색 중 일때
    if (isLoading && !isFirstLoad.current) {
      return <SearchLoading />;
    }

    // 데이터가 없거나 검색 결과가 없을 때
    if (boardList && boardList.data.length === 0) {
      return (
        <div className="flex items-center justify-center min-h-[500px] flex-col gap-3">
          <TbMoodEmpty className="w-8 h-8 lg:w-10 lg:h-10" />
          <h2 className="text-xs lg:text-sm">
            {searchKeyWord ? "검색 결과가 없습니다." : "게시글이 없습니다."}
          </h2>
        </div>
      );
    }
    return <BoardList boards={boardList} keyword={searchKeyWord} />;
  };

  return (
    <>
      <div className="lg:flex justify-between items-center px-5 lg:px-0">
        <h2 className="text-lg lg:text-xl font-bold mb-5 lg:mb-0">
          자유게시판
        </h2>
        <BoardActions
          onSearch={handleSearch}
          onClickWrite={onClickBoardWrite}
        />
      </div>
      <div
        className={`mt-5 lg:mt-10 min-h-auto rounded-md overflow-hidden ${
          (isLoading && !isFirstLoad.current) ||
          (boardList && boardList.data.length === 0)
            ? ""
            : "lg:shadow"
        }`}
      >
        <BoardListHeader />
        {renderBoardContent()}
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
