import { Skeleton } from "@/components/ui/skeleton";

const ProductInfoSkeleton = () => {
  return (
    <div className="flex flex-col lg:flex-row lg:gap-20 justify-center lg:justify-between items-center">
      <div className="overflow-hidden relative h-auto lg:w-2/4 w-full flex items-center justify-center">
        <Skeleton className="w-full aspect-square" />
      </div>
      <div className="w-full my-8 lg:w-2/4 lg:my-0">
        <div className="flex items-start justify-between">
          <Skeleton className="h-7 w-3/4 mb-1" />
          <Skeleton className="h-7 w-7" />
        </div>
        <div className="mb-5">
          <Skeleton className="h-6 w-32 mb-1" />
          <div className="flex gap-2 items-center">
            <Skeleton className="h-7 w-24" />
          </div>
          <ul className="my-5 text-sm">
            <li className="flex py-3 px-3 border-y">
              <Skeleton className="w-[100px] h-5" />
              <Skeleton className="flex-1 h-5 ml-4" />
            </li>
            <li className="flex py-3 px-3 border-b">
              <Skeleton className="w-[100px] h-5" />
              <Skeleton className="flex-1 h-5 ml-4" />
            </li>
            <li className="flex py-3 px-3 border-b">
              <Skeleton className="w-[100px] h-5" />
              <Skeleton className="flex-1 h-5 ml-4" />
            </li>
            <li className="flex py-3 px-3 border-b">
              <Skeleton className="w-[100px] h-5" />
              <Skeleton className="flex-1 h-5 ml-4" />
            </li>
            <li className="flex py-3 px-3 border-b">
              <Skeleton className="w-[100px] h-5" />
              <Skeleton className="flex-1 h-5 ml-4" />
            </li>
          </ul>
          <div className="justify-end flex gap-3 items-baseline">
            <Skeleton className="h-7 w-40" />
          </div>
        </div>
        <div className="flex items-stretch justify-center gap-1 lg:gap-2">
          <Skeleton className="w-1/5 h-12" />
          <Skeleton className="w-2/4 h-12" />
          <Skeleton className="w-2/4 h-12" />
        </div>
      </div>
    </div>
  );
};

export default ProductInfoSkeleton;
