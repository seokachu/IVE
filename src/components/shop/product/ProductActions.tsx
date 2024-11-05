"use client";
import { useRouter } from "next/navigation";
import { IoIosHeartEmpty } from "react-icons/io";

const ProductActions = () => {
  const { push } = useRouter();
  const onClickCart = () => {};

  const onClickBuying = () => {
    push("/cart");
  };

  return (
    <ul className="flex items-center justify-center gap-3">
      <li className="w-1/6 border-2 border-purple cursor-pointer flex items-center justify-center py-3 rounded-md bg-purple">
        <IoIosHeartEmpty size={25} className="text-white" />
      </li>
      <li
        onClick={onClickCart}
        className="w-2/4 border-2 border-purple py-3 text-center cursor-pointer rounded-md"
      >
        장바구니
      </li>
      <li
        onClick={onClickBuying}
        className="w-2/4 border-2 border-purple bg-purple py-3 text-center cursor-pointer rounded-md text-white"
      >
        구매하기
      </li>
    </ul>
  );
};

export default ProductActions;
