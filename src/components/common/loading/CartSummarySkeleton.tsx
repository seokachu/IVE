import { Skeleton } from "@/components/ui/skeleton";

const CartSummarySkeleton = () => {
  return (
    <div className="lg:sticky lg:top-5 flex-1 border rounded-md bg-white shadow-sm p-5 lg:p-10 h-fit">
      <div className="mb-12">
        <Skeleton className="h-7 w-24 mb-5" />
        <div className="border-b pb-3 flex justify-between items-center">
          <Skeleton className="h-7 w-20" />
          <div className="flex items-center">
            <Skeleton className="h-7 w-24 mr-1" />
          </div>
        </div>
        <div className="pt-5 mb-10">
          <div className="mb-2 flex justify-between items-center">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      </div>
      <div className="mb-12">
        <div className="border-b pb-3 flex justify-between items-center">
          <Skeleton className="h-7 w-20" />
          <div className="flex items-center">
            <Skeleton className="h-7 w-24 mr-1" />
          </div>
        </div>
        <div className="pt-5 mb-10">
          <div className="mb-2 flex items-center gap-10">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-full" />
          </div>
          <div className="mb-2 flex items-center gap-10">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-full" />
          </div>
          <div className="mb-2 flex items-center gap-10">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-full" />
          </div>
        </div>
      </div>
      <div className="mb-12">
        <div className="border-b pb-3 flex justify-between items-center">
          <Skeleton className="h-7 w-32" />
          <div className="flex items-center">
            <Skeleton className="h-7 w-24 mr-1" />
          </div>
        </div>
        <div className="pt-5 mb-10">
          <div className="mb-2 flex items-center gap-10">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-full" />
          </div>
          <div className="mb-2 flex items-center gap-10">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-full" />
          </div>
          <div className="mb-2 flex items-center gap-10">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-full" />
          </div>
        </div>
      </div>
      <div className="mb-1">
        <div className="border-b pb-3 flex justify-between items-center">
          <Skeleton className="h-7 w-20" />
        </div>
        <div className="pt-5 mb-5">
          <Skeleton className="mb-3 h-5 w-full" />
          <Skeleton className="h-5 w-full" />
        </div>
      </div>
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  );
};

export default CartSummarySkeleton;
