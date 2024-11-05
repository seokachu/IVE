const TabMenu = () => {
  return (
    <div className="mb-28">
      <ul className="flex justify-between items-center text-center cursor-pointer">
        <li className="w-2/4 border-b-2 border-dark-gray py-4">
          <h3 className="font-bold">상세정보</h3>
        </li>
        <li className="w-2/4 border-b py-4">
          <h3 className="flex gap-2 justify-center items-center">
            리뷰<span>1</span>
          </h3>
        </li>
      </ul>
    </div>
  );
};

export default TabMenu;
