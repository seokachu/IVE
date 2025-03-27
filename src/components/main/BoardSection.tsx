import Link from "next/link";
import MainBoardList from "./MainBoardList";

const BoardSection = () => {
  return (
    <section className="w-full h-full">
      <div className="max-w-[1280px] flex justify-center align-center flex-col px-5 py-16 m-auto">
        <h2 className="text-2xl font-bold lg:text-4xl text-center mb-14">FREE BOARD</h2>
        <div className="w-full">
          <Link href="/board" className="float-right hover:text-purple">
            더보기
          </Link>
        </div>
        <MainBoardList />
      </div>
    </section>
  );
};

export default BoardSection;
