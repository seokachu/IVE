import { Skeleton } from "@/components/ui/skeleton";

const NewsFeedSkeleton = () => {
  return (
    <section className="max-w-content flex justify-center align-center flex-col px-5 py-32 m-auto">
      <div className="flex flex-col items-center mb-12">
        <Skeleton className="w-56 h-12" />
        <Skeleton className="w-80 h-5 mt-5 mb-12" />
        <Skeleton className="w-96 h-12 rounded-full" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 w-full">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="aspect-square w-full" />
        ))}
      </div>
    </section>
  );
};

export default NewsFeedSkeleton;
