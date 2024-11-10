import { IoSearch } from "react-icons/io5";
import PaginationControl from "@/components/common/PaginationControl";
import BoardListItems from "@/components/board/BoardListItems";
import BoardListHeader from "@/components/board/BoardListHeader";

const page = () => {
  return (
    <main className="w-full min-h-screen">
      <section className="max-w-[1320px] m-auto px-5 pt-14 pb-28 lg:px-8">
        <h2 className="text-2xl font-bold mb-5">자유게시판</h2>
        <div className="flex flex-col lg:items-end">
          <button className="w-full lg:w-[100px] text-sm border border-purple bg-purple mb-3 px-3 py-2 rounded-md text-white">
            글쓰기
          </button>
          <form>
            <div className="relative w-full lg:w-[420px]">
              <input
                type="text"
                placeholder="검색어를 입력해 주세요."
                className="px-5 py-2 border rounded-full w-full"
              />
              <IoSearch
                size={20}
                className="absolute right-5 top-2/4 -translate-y-2/4"
              />
            </div>
          </form>
        </div>
        <div className="mt-10 min-h-screen">
          <BoardListHeader />
          <ul>
            <BoardListItems />
          </ul>
        </div>
        <PaginationControl />
      </section>
    </main>
  );
};

export default page;
