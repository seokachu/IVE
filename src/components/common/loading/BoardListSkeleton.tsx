import { Skeleton } from "@/components/ui/skeleton";

const BoardListSkeleton = () => {
  return (
    <li className="py-3 px-1 border-b first:border-t lg:first:border-t-0 lg:h-[50px]">
      {/* Desktop */}
      <div className="hidden lg:flex">
        <div className="w-[10%] flex justify-center">
          <Skeleton className="w-4/5 h-5 lg:h-6" />
        </div>
        <div className="w-[40%] flex justify-center">
          <Skeleton className="w-4/5 h-5 lg:h-6" />
        </div>
        <div className="w-[15%] flex justify-start pl-3">
          <Skeleton className="w-4/5 h-5 lg:h-6" />
        </div>
        <div className="w-[15%] flex justify-center">
          <Skeleton className="w-4/5 h-5 lg:h-6" />
        </div>
        <div className="w-[10%] flex justify-center">
          <Skeleton className="w-4/5 h-5 lg:h-6" />
        </div>
        <div className="w-[10%] flex justify-center">
          <Skeleton className="w-4/5 h-5 lg:h-6" />
        </div>
      </div>
      {/* Mobile */}
      <div className="lg:hidden flex items-center justify-between px-5">
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <Skeleton className="w-10/12 h-7" />
          <div className="flex gap-2">
            <Skeleton className="w-1/6 h-4" />
            <Skeleton className="w-1/12 h-4" />
            <Skeleton className="w-1/12 h-4" />
            <Skeleton className="w-1/6 h-4" />
          </div>
        </div>
        <Skeleton className="w-12 h-16" />
      </div>
    </li>
  );
};

export default BoardListSkeleton;
