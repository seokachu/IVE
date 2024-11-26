"use client";
import ActionButton from "@/components/common/button/ActionButton";
import { IoIosHeartEmpty } from "react-icons/io";
import { useState } from "react";
import AddToCartDrawer from "./AddToCartDrawer";
import { cartStorage } from "@/utils/cartStorage";
import { toast } from "@/hooks/use-toast";
import type { CartItem, ProductActionsProps } from "@/types";
import { useSetRecoilState } from "recoil";
import { cartState } from "@/store";

const ProductActions = ({ product, quantity }: ProductActionsProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const setCartItems = useSetRecoilState(cartState);

  const onClickCart = () => {
    try {
      //현재 장바구니에 담긴 수량 확인
      const currentQuantity = cartStorage.getItemQuantity(product.id);

      //추가할 수량과 합쳐서 5개를 초과하는지 체크
      if (currentQuantity + quantity > 5) {
        toast({
          title: `현재 장바구니에 ${currentQuantity}개가 있어 ${quantity}개를 추가할 수 없습니다.`,
          description: "최대 구매 가능 수량은 5개입니다.",
        });
        return;
      }

      const cartItem: CartItem = {
        ...product,
        quantity,
      };

      const updatedCart = cartStorage.addItem(cartItem);
      setCartItems(updatedCart);
      setIsDrawerOpen(true);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: error.message,
        });
      }
    }
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
