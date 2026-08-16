import { Skeleton } from "@/components/ui/skeleton";

const BoardListSkeleton = () => {
  return (
    <li className="flex items-center gap-3 lg:gap-4 px-2 py-3.5 lg:py-4">
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <Skeleton className="w-2/3 h-5" />
        <div className="flex items-center gap-1.5">
          <Skeleton className="w-5 h-5 rounded-full" />
          <Skeleton className="w-40 h-4" />
        </div>
      </div>
      <Skeleton className="w-16 h-8 rounded-full shrink-0" />
    </li>
  );
};

export default BoardListSkeleton;
