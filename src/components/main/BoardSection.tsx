import MainBoardListItems from "./items/MainBoardListItems";

const BoardSection = () => {
  return (
    <section className="bg-white w-full h-full">
      <div className="max-w-[1280px] flex justify-center align-center flex-col px-5 py-16 m-auto">
        <h2 className="text-2xl font-bold lg:text-4xl text-center mb-14">
          FREE BOARD
        </h2>
        <div>{/* <MoreButton /> */}</div>
        <ul className="flex flex-wrap">
          <MainBoardListItems />
          <MainBoardListItems />
        </ul>
      </div>
    </section>
  );
};

export default BoardSection;
