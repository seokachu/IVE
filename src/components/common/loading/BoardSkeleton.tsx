import { Skeleton } from "@/components/ui/skeleton";
import BoardListSkeleton from "./BoardListSkeleton";

const BoardSkeleton = () => {
  return (
    <>
      <div className="lg:flex justify-between items-center">
        <h2 className="text-lg lg:text-xl font-bold mb-5 lg:mb-0">
          자유게시판
        </h2>
        <div className="flex items-center justify-end gap-3 flex-col lg:flex-row lg:w-2/3">
          <Skeleton className="w-full lg:w-80 h-10" />
          <Skeleton className="w-full lg:w-28 h-10" />
        </div>
      </div>
      <div className="mt-10 min-h-auto shadow rounded-md overflow-hidden">
        <ul className="flex text-center py-3 bg-gray-100 text-sm border-dark-gray lg:text-base">
          <li className="w-[10%]">번호</li>
          <li className="w-[50%] lg:w-[40%]">제목</li>
          <li className="w-[20%] text-left">작성자</li>
          <li className="w-[20%]">작성일</li>
          <li className="w-[10%] hidden lg:block">조회</li>
        </ul>
        <ul>
          {Array.from({ length: 10 }).map((_, index) => (
            <BoardListSkeleton key={index} />
          ))}
        </ul>
      </div>
      <Skeleton className="w-24 h-8 m-auto mt-10" />
    </>
  );
};

export default BoardSkeleton;
