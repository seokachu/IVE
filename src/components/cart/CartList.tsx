import SelectionControl from "../common/SelectionControl";
import CartListItems from "./CartListItems";
import { useId } from "react";

const CartList = () => {
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
      <SelectionControl />
      <ul>
        <CartListItems />
      </ul>
    </div>
  );
};

export default CartList;
