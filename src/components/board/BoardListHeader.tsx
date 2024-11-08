const BoardListHeader = () => {
  return (
    <ul className="flex text-center py-3 border-b border-dark-gray text-sm lg:text-base">
      <li className="w-[10%]">번호</li>
      <li className="w-[50%]">제목</li>
      <li className="w-[20%] text-left">글쓴이</li>
      <li className="w-[20%]">등록일</li>
      <li className="w-[10%] hidden lg:block">댓글</li>
      <li className="w-[10%] hidden lg:block">추천</li>
    </ul>
  );
};

export default BoardListHeader;
