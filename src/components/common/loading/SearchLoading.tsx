import { SyncLoader } from "react-spinners";

const SearchLoading = () => {
  return (
    <div className="min-h-[500px] flex flex-col items-center justify-center gap-5">
      <SyncLoader />
      <h2 className="text-xs lg:text-sm">검색 중...</h2>
    </div>
  );
};

export default SearchLoading;
