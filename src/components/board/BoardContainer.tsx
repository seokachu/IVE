"use client";
import ActionButton from "@/components/common/button/ActionButton";
import Search from "@/components/common/search/Search";
import BoardListHeader from "@/components/board/BoardListHeader";
import { GoPlusCircle } from "react-icons/go";
import BoardList from "./BoardList";
import { useRouter } from "next/navigation";
// import PaginationControl from "../common/PaginationControl";

const BoardContainer = () => {
  const { push } = useRouter();

  const onClickBoardWrite = () => {
    push("board/write");
  };

  return (
    <>
      <div className="lg:flex justify-between items-center">
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
      <div className="mt-10 min-h-auto shadow rounded-md overflow-hidden">
        <BoardListHeader />
        <BoardList />
      </div>
      {/* <PaginationControl /> */}
    </>
  );
};

export default BoardContainer;
