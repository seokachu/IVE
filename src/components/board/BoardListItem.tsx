"use client";
import { useRouter } from "next/navigation";

const BoardListItem = () => {
  const { push } = useRouter();
  const onClickBoardDetail = () => {
    push("/board/1");
  };

  return (
    <li
      onClick={onClickBoardDetail}
      className="text-center flex text-sm lg:text-base py-3 border-b hover:bg-gray-50 cursor-pointer"
    >
      <p className="w-[10%] text-gray-500">1</p>
      <div className="w-[50%] text-left flex gap-1">
        <p className="text-left max-w-[80%] truncate">
          제목입니다.제목이야 내용이 많아요우하하하하하하
        </p>
        <p className="text-blue-500">[12]</p>
      </div>
      <h3 className="w-[20%] text-left shrink-0">글쓴이입니다</h3>
      <time className="w-[20%] text-gray-500">2024-04-04</time>
      <p className="w-[10%] text-gray-500 hidden lg:block">0</p>
    </li>
  );
};

export default BoardListItem;
