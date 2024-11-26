import { Skeleton } from "@/components/ui/skeleton";

const ReviewTabSkeleton = () => {
  return (
    <>
      <div className="flex justify-center items-center mb-10">
        <Skeleton className="w-64 h-8" />
      </div>
      <div>
        <Skeleton className="w-32 h-10 mb-5" />
        <ul className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <li key={index} className="border-b py-6">
              <div className="flex justify-between mb-2">
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div>
                    <Skeleton className="w-24 h-5 mb-1" />
                    <Skeleton className="w-24 h-5" />
                  </div>
                </div>
                <div className="flex gap-1">
                  <Skeleton className="w-20 h-5" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="w-full lg:w-2/3 h-6" />
              </div>
            </li>
          ))}
        </ul>
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="w-8 h-8" />
          ))}
        </div>
      </div>
    </>
  );
};

export default ReviewTabSkeleton;
