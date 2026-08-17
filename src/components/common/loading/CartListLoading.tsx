import { Skeleton } from "@/components/ui/skeleton";

const CartListLoading = () => {
  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-center justify-between px-1 pb-1">
        <Skeleton className="h-5 w-28" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-[74px] rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-3.5">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-card p-5">
            <Skeleton className="h-4 w-4 shrink-0" />
            <Skeleton className="h-[88px] w-[88px] shrink-0 rounded-xl" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5 pr-1 lg:pr-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartListLoading;
