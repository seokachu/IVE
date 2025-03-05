import { Skeleton } from "@/components/ui/skeleton";
import { ClipLoader } from "react-spinners";

const BoardDetailSkeleton = () => {
  return (
    <>
      <div className="flex border-b py-5 items-center">
        <div className="flex flex-col gap-2">
          <h2 className="pr-5">
            <Skeleton className="w-full h-7" />
          </h2>
          <div className="flex gap-3">
            <Skeleton className="w-20 h-4" />
            <Skeleton className="w-10 h-4" />
            <Skeleton className="w-10 h-4" />
          </div>
        </div>
        <div className="flex flex-col ml-auto justify-end shrink-0">
          <div className="flex gap-3 text-sm items-center">
            <Skeleton className="w-7 h-7" />
            <Skeleton className="w-8 h-7" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center min-h-96">
        <ClipLoader />
      </div>
      <div className="flex items-center justify-center mb-5">
        <Skeleton className="w-16 h-12" />
      </div>
      <Skeleton className="rounded-md py-3 px-2 lg:px-5 h-24" />
      <div className="flex gap-4 mt-5 border-t pt-5 pb-5">
        <Skeleton className="w-32 h-7" />
      </div>
      <div className="flex items-center mb-5 w-full gap-2">
        <Skeleton className="w-full h-14" />
        <Skeleton className="w-20 h-14" />
      </div>
    </>
  );
};

export default BoardDetailSkeleton;
