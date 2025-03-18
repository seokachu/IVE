import { ClipLoader } from "react-spinners";

const BoardWriteSkeleton = () => {
  return (
    <div className="w-full rounded-sm min-h-[543px] bg-white border flex items-center justify-center">
      <ClipLoader />
    </div>
  );
};

export default BoardWriteSkeleton;
