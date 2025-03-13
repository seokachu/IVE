import { Skeleton } from "@/components/ui/skeleton";

const LatestNewsSkeleton = () => {
  return (
    <section className="max-w-[1280px] flex justify-center align-center flex-col px-5 py-32 m-auto">
      <div className="flex flex-col items-center mb-12">
        <Skeleton className="w-56 h-12" />
        <Skeleton className="w-80 h-5 mt-5 mb-12" />
        <Skeleton className="w-96 h-12 rounded-full" />
      </div>
      <div className="mb-10">
        <Skeleton className="aspect-[16/9]" />
      </div>
      <div className="flex flex-wrap gap-10">
        <div className="w-[calc(50%-1.25rem)]">
          <Skeleton className="aspect-[16/9] w-full" />
        </div>
        <div className="w-[calc(50%-1.25rem)]">
          <Skeleton className="aspect-[16/9] w-full" />
        </div>
        <div className="w-[calc(50%-1.25rem)]">
          <Skeleton className="aspect-[16/9] w-full" />
        </div>
        <div className="w-[calc(50%-1.25rem)]">
          <Skeleton className="aspect-[16/9] w-full" />
        </div>
      </div>
    </section>
  );
};

export default LatestNewsSkeleton;
