"use client";
import ActionButton from "@/components/common/button/ActionButton";
import { IoIosHeartEmpty } from "react-icons/io";
import { useState } from "react";
import AddToCartDrawer from "./AddToCartDrawer";

const ProductActions = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const onClickCart = () => {
    setIsDrawerOpen(true);
    //로컬스토리지 저장
  };

  const onClickCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const onClickBuying = () => {
    //결제 페이지로 넘어가야 함
  };

  return (
    <>
      <ul className="flex items-stretch justify-center gap-3">
        <li className="w-1/6">
          <ActionButton
            variant="primary"
            className="w-full h-full flex items-center justify-center py-5"
          >
            <IoIosHeartEmpty size={25} className="text-white" />
          </ActionButton>
        </li>
        <li className="w-2/4">
          <ActionButton
            onClick={onClickCart}
            variant="outline"
            className="w-full py-3 text-center"
          >
            장바구니
          </ActionButton>
        </li>
        <li className="w-2/4">
          <ActionButton
            onClick={onClickBuying}
            variant="primary"
            className="w-full py-3 text-center"
          >
            구매하기
          </ActionButton>
        </li>
      </ul>
      {isDrawerOpen && (
        <AddToCartDrawer isOpen={isDrawerOpen} onClose={onClickCloseDrawer} />
      )}
    </>
  );
};

export default ProductActions;
