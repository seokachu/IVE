import CartListItems from "./CartListItems";
import { useId } from "react";

const CartList = () => {
  const id = useId();

  return (
    <div className="flex-[2] p-10 border rounded-md bg-white shadow-sm min-h-[500px]">
      <h2 className="font-bold text-xl">장바구니</h2>
      {/* <div className="flex items-center justify-center flex-col gap-2 min-h-[500px] lg:min-h-full">
    <h3>장바구니가 비어있습니다.</h3>
    <p className="text-gray-500 text-sm mb-5">
      원하는 상품을 담아보세요!
    </p>
    <button className="border text-sm py-2 px-5 rounded-md border-purple text-purple hover:text-white hover:bg-purple transition-all ease-out duration-300">
      쇼핑하기
    </button>
  </div> */}
      <div className="flex text-sm items-center justify-between mt-5 pb-5 border-b border-dark-gray">
        <label htmlFor={`selectAll-${id}`}>
          <input
            type="checkbox"
            id={`selectAll-${id}`}
            className="mr-[6px] w-4 h-4 translate-y-[3px]"
          />
          전체선택 1/3
        </label>
        <button className="px-2 py-1 border rounded-md">전체삭제</button>
      </div>
      <ul>
        <CartListItems />
      </ul>
    </div>
  );
};

export default CartList;
