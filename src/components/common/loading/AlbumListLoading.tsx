import { Skeleton } from "@/components/ui/skeleton";

const AlbumListLoading = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center p-5 lg:flex-row lg:gap-12 lg:p-0">
        <div className="w-full sm:max-w-[300px] lg:max-w-[500px] h-auto lg:shrink-0">
          <Skeleton className="w-full max-w-[500px] h-[500px]" />
        </div>
        <div>
          <Skeleton className="h-8 w-36 mt-5 mb-2" />
          <Skeleton className="h-5 w-60 mt-5 mb-2" />
          <Skeleton className="h-5 w-32 mt-5 mb-2" />
          <Skeleton className="w-60 h-[1px] mt-5" />
          <div className="flex gap-2 mt-5">
            <Skeleton className="rounded-full w-10 h-10" />
            <Skeleton className="rounded-full w-10 h-10" />
            <Skeleton className="rounded-full w-10 h-10" />
            <Skeleton className="rounded-full w-10 h-10" />
            <Skeleton className="rounded-full w-10 h-10" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center mt-10">
        <Skeleton className="h-5 w-20" />
      </div>
    </>
  );
};

export default AlbumListLoading;
