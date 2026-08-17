import { Skeleton } from "@/components/ui/skeleton";

const CartSummarySkeleton = () => {
  return (
    <aside className="flex w-full flex-col gap-4 lg:sticky lg:top-24 lg:w-[400px] lg:shrink-0">
      <div className="rounded-[20px] border border-gray-200 bg-card p-7">
        <Skeleton className="h-6 w-20" />
        <div className="mt-4 flex flex-col gap-2.5">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-end justify-between border-t border-gray-200 pt-4">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-8 w-28" />
        </div>
        <Skeleton className="mt-5 h-5 w-full" />
        <Skeleton className="mt-5 h-14 w-full rounded-full" />
      </div>
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="rounded-2xl border border-gray-200 bg-card p-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-6 w-12 rounded-full" />
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </aside>
  );
};

export default CartSummarySkeleton;
