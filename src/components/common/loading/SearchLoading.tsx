import Spinner from "@/components/common/Spinner";

const SearchLoading = () => {
  return (
    <div className="min-h-[500px] flex flex-col items-center justify-center gap-5">
      <Spinner />
      <h2 className="text-xs lg:text-sm">검색 중...</h2>
    </div>
  );
};

export default SearchLoading;
