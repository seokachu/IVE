const BoardListHeader = () => {
  return (
    <ul className="hidden lg:flex text-center py-3 bg-gray-100 border-dark-gray lg:h-[50px]">
      <li className="w-[10%]">번호</li>
      <li className="w-[40%]">제목</li>
      <li className="w-[15%] text-left pl-3">작성자</li>
      <li className="w-[15%]">작성일</li>
      <li className="w-[10%]">조회</li>
      <li className="w-[10%]">추천</li>
    </ul>
  );
};

export default BoardListHeader;
