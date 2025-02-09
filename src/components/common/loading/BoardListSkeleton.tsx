import { Skeleton } from "@/components/ui/skeleton";

const BoardListSkeleton = () => {
  return (
    <li className="flex justify-center items-center gap-10 py-3 px-3 border-b hover:bg-gray-50">
      <Skeleton className="w-[10%] h-5 lg:h-6" />
      <Skeleton className="w-[50%] lg:w-[40%] h-5 lg:h-6" />
      <Skeleton className="w-[20%] h-5 lg:h-6" />
      <Skeleton className="w-[20%] h-5 lg:h-6" />
      <Skeleton className="w-[10%] h-5 lg:h-6 hidden lg:block" />
    </li>
  );
};

export default BoardListSkeleton;
