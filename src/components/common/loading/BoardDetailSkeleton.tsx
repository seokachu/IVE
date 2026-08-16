import { Skeleton } from "@/components/ui/skeleton";

const BoardDetailSkeleton = () => {
  return (
    <div className="max-w-[800px] m-auto flex flex-col gap-6 lg:gap-7 pt-6 lg:pt-8">
      <div className="flex items-center justify-between">
        <Skeleton className="w-24 h-9 rounded-full" />
        <div className="flex items-center gap-2">
          <Skeleton className="w-9 h-9 rounded-full" />
          <Skeleton className="w-9 h-9 rounded-full" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Skeleton className="w-3/4 h-8 lg:h-10" />
        <div className="flex items-center gap-2.5">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-32 h-3" />
          </div>
        </div>
      </div>
      <Skeleton className="w-full h-px" />
      <div className="flex flex-col gap-3">
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-11/12 h-4" />
        <Skeleton className="w-full h-72 rounded-xl" />
        <Skeleton className="w-2/3 h-4" />
      </div>
      <div className="flex justify-center">
        <Skeleton className="w-36 h-12 rounded-full" />
      </div>
      <Skeleton className="w-full h-[76px] rounded-2xl" />
      <Skeleton className="w-full h-24 rounded-lg" />
      <div className="flex flex-col gap-4">
        <Skeleton className="w-24 h-6" />
        <Skeleton className="w-full h-24 rounded-xl" />
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex gap-2.5">
            <Skeleton className="w-9 h-9 rounded-full shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <Skeleton className="w-32 h-4" />
              <Skeleton className="w-full h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardDetailSkeleton;
