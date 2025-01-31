import { Skeleton } from "@/components/ui/skeleton";

const MyPageSkeleton = () => {
  return (
    <div>
      <div>
        <Skeleton className="w-[62px] h-[62px] rounded-full" />
        <Skeleton className="w-28 h-8 my-6" />
      </div>
      <div className="flex border-y p-5 my-5">
        <div className="w-2/4">
          <Skeleton className="w-10 h-4 mb-[9px]" />
          <Skeleton className="w-10 h-5" />
        </div>
        <div className="w-2/4">
          <Skeleton className="w-10 h-4 mb-[9px]" />
          <Skeleton className="w-10 h-5" />
        </div>
      </div>
      <div className="flex lg:flex-col gap-3 lg:gap-1 border-b lg:border-none">
        <Skeleton className="w-2/12 lg:w-24 h-6 mb-5" />
        <Skeleton className="w-2/12 lg:w-24 h-6 mb-5" />
        <Skeleton className="w-2/12 lg:w-24 h-6 mb-5" />
        <Skeleton className="w-2/12 lg:w-24 h-6 mb-5" />
      </div>
    </div>
  );
};

export default MyPageSkeleton;
