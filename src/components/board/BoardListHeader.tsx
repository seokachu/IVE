const BoardListHeader = () => {
  return (
    <ul className="flex text-center py-3 bg-gray-100 text-sm border-dark-gray lg:text-base">
      <li className="w-[10%]">번호</li>
      <li className="w-[50%] lg:w-[40%]">제목</li>
      <li className="w-[20%] text-left">작성자</li>
      <li className="w-[20%]">작성일</li>
      <li className="w-[10%] hidden lg:block">조회</li>
    </ul>
  );
};

export default BoardListHeader;
