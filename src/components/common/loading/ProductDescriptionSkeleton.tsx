import { Skeleton } from "@/components/ui/skeleton";

const ProductDescriptionSkeleton = () => {
  return (
    <div className="text-center">
      <Skeleton className="h-8 w-72 mx-auto mb-10" />
      <div className="flex flex-col gap-1">
        <Skeleton className="h-5 w-3/4 mx-auto" />
        <Skeleton className="h-5 w-2/4 mx-auto" />
      </div>
      <div className="w-full h-auto m-auto relative my-16">
        <Skeleton className="w-[500px] h-[500px] mx-auto" />
      </div>
      <div>
        <Skeleton className="h-5 w-3/4 mx-auto" />
        <Skeleton className="h-5 w-2/4 mx-auto mt-2" />
      </div>
      <div className="w-full h-auto m-auto relative my-16">
        <Skeleton className="w-[500px] h-[500px] mx-auto" />
      </div>
      <div className="w-full h-auto m-auto relative my-16">
        <Skeleton className="w-[500px] h-[500px] mx-auto" />
      </div>
      <div>
        <Skeleton className="h-5 w-3/4 mx-auto" />
        <Skeleton className="h-5 w-2/4 mx-auto mt-2" />
      </div>
    </div>
  );
};

export default ProductDescriptionSkeleton;
