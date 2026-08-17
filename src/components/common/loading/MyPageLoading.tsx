import Spinner from "@/components/common/Spinner";

interface MyPageLoadingProps {
  title?: string;
}

const MyPageLoading = ({ title }: MyPageLoadingProps) => {
  return (
    <div>
      {title && <h2 className="mb-5 text-[22px] font-bold leading-tight">{title}</h2>}
      <div className="flex h-[300px] w-full items-center justify-center">
        <Spinner />
      </div>
    </div>
  );
};

export default MyPageLoading;
