import { Skeleton } from "@/components/ui/skeleton";

const MainBoardListSkeleton = () => {
  return (
    <li className="flex gap-5 items-center justify-center mt-5 w-full lg:w-2/4 lg:justify-start">
      <div className="cursor-pointer flex gap-5 items-center w-full">
        <div className="border overflow-hidden rounded-lg">
          <Skeleton className="w-[70px] h-[70px] lg:w-[100px] lg:h-[100px]" />
        </div>
        <div className="flex flex-col gap-2 w-2/3">
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-32 h-5" />
        </div>
      </div>
    </li>
  );
};

export default MainBoardListSkeleton;
