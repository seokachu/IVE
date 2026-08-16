import { Skeleton } from "@/components/ui/skeleton";

const ScheduleSkeleton = () => {
  return (
    <section className="max-w-content flex justify-center align-center flex-col px-5 pt-32 m-auto">
      <div className="flex flex-col items-center mb-12">
        <Skeleton className="w-56 h-12" />
        <Skeleton className="w-80 h-5 mt-5 mb-10" />
        <Skeleton className="w-64 h-12 rounded-full" />
      </div>
      <div className="max-w-3xl w-full m-auto flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-24 w-full" />
        ))}
      </div>
    </section>
  );
};

export default ScheduleSkeleton;
