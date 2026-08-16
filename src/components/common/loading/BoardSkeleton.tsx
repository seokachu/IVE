import { Skeleton } from "@/components/ui/skeleton";
import BoardListSkeleton from "./BoardListSkeleton";

const BoardSkeleton = () => {
  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <Skeleton className="w-72 h-10 rounded-full" />
        <div className="flex items-center gap-2.5">
          <Skeleton className="hidden lg:block w-24 h-10 rounded-full" />
          <Skeleton className="flex-1 lg:flex-none lg:w-[240px] h-10 rounded-full" />
          <Skeleton className="w-24 h-10 rounded-full" />
        </div>
      </div>
      <div className="mt-5 lg:mt-6">
        <Skeleton className="w-full h-11 rounded-lg mb-3" />
        <ul className="divide-y divide-gray-200">
          {Array.from({ length: 10 }).map((_, index) => (
            <BoardListSkeleton key={index} />
          ))}
        </ul>
      </div>
    </>
  );
};

export default BoardSkeleton;
