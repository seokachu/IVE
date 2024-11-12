import { IoSearch } from "react-icons/io5";
import PaginationControl from "@/components/common/PaginationControl";
import BoardListItems from "@/components/board/BoardListItems";
import BoardListHeader from "@/components/board/BoardListHeader";
import { GoPlusCircle } from "react-icons/go";

const page = () => {
  return (
    <main className="w-full min-h-screen">
      <section className="max-w-[1320px] m-auto px-5 pt-14 pb-28 lg:px-8">
        <h2 className="text-2xl font-bold mb-5">자유게시판</h2>
        <div className="flex items-center gap-3 justify-center lg:justify-end flex-col lg:flex-row">
          <div className="relative w-full lg:max-w-80">
            <input
              type="text"
              placeholder="검색어를 입력하세요."
              className="pl-10 pr-4 py-2 border rounded-md w-full"
            />
            <IoSearch className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button className="flex items-center justify-center gap-2 bg-purple text-white px-4 py-2 rounded-lg w-full lg:w-28">
            <GoPlusCircle className="w-5 h-5" />
            글쓰기
          </button>
        </div>
        <div className="mt-10 min-h-auto shadow rounded-md overflow-hidden">
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
