import { ClipLoader } from "react-spinners";

interface MyPageLoadingProps {
  title?: string;
}

const MyPageLoading = ({ title }: MyPageLoadingProps) => {
  return (
    <div className="px-5 lg:pt-14 pb-28 lg:px-8">
      <div className="flex justify-between items-center mt-5 lg:mt-0">
        <h2 className="font-bold text-xl mb-5 hidden lg:block">{title}</h2>
      </div>
      <div className="flex flex-col gap-3 items-center justify-center w-full h-[250px] lg:h-[500px]">
        <ClipLoader />
      </div>
    </div>
  );
};

export default MyPageLoading;
