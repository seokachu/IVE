import { Skeleton } from "@/components/ui/skeleton";

const ShopSkeleton = () => {
  return (
    <li className="w-[280px] border p-4 rounded-lg mb-10">
      <div className="relative w-full h-64 rounded-lg border">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <Skeleton className="h-6 w-3/4 rounded" />
        <Skeleton className="h-4 w-1/2 rounded" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-8 rounded" />
          <Skeleton className="h-6 w-16 rounded" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-10 rounded" />
        </div>
      </div>
    </li>
  );
};

export default ShopSkeleton;
