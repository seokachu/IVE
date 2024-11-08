import { IoSearch } from "react-icons/io5";
import PaginationControl from "@/components/common/PaginationControl";
import BoardListItems from "@/components/board/BoardListItems";

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
        <div className="mt-10">
          <ul className="flex text-center pb-3 border-b border-dark-gray text-sm lg:text-base">
            <li className="w-[10%]">번호</li>
            <li className="w-[50%]">제목</li>
            <li className="w-[20%] text-left">글쓴이</li>
            <li className="w-[20%]">등록일</li>
            <li className="w-[10%] hidden lg:block">댓글</li>
            <li className="w-[10%] hidden lg:block">추천</li>
          </ul>
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
