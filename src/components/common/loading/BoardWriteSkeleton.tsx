import Spinner from "@/components/common/Spinner";

const BoardWriteSkeleton = () => {
  return (
    <div className="w-full rounded-sm min-h-[543px] bg-background border flex items-center justify-center">
      <Spinner />
    </div>
  );
};

export default BoardWriteSkeleton;
