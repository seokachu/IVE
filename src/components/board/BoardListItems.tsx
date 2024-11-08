"use client";

import { useRouter } from "next/navigation";

const BoardListItems = () => {
  const { push } = useRouter();
  const onClickBoardDetail = () => {
    push("/board/1");
  };

  return (
    <li
      onClick={onClickBoardDetail}
      className="text-center flex text-sm lg:text-base py-3 border-b hover:bg-silver-gray cursor-pointer"
    >
      <p className="w-[10%]">1</p>
      <p className="w-[50%] text-left truncate px-5">
        제목입니다.asdlfka';sdlkfa';sdlfja;sldkfjalsdkjfa;lskj
      </p>
      <h3 className="w-[20%] text-left">글쓴이입니다</h3>
      <time className="w-[20%]">2024.04.04</time>
      <p className="w-[10%] hidden lg:block">0</p>
      <p className="w-[10%] hidden lg:block">1</p>
    </li>
  );
};

export default BoardListItems;
