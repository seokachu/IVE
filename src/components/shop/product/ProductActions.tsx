"use client";
import ActionButton from "@/components/common/button/ActionButton";
import { useState } from "react";
import AddToCartDrawer from "./AddToCartDrawer";
import { cartStorage } from "@/utils/cartStorage";
import { toast } from "@/hooks/use-toast";
import { useSetRecoilState } from "recoil";
import { cartState } from "@/store";
import useWishListWithLocal from "@/hooks/queries/useWishListWithLocal";
import { GoHeartFill } from "react-icons/go";
import { GoHeart } from "react-icons/go";
import DirectPaymentButton from "@/components/payment/DirectPaymentButton";
import type { ProductActionsProps } from "@/types/shop";
import type { CartItem } from "@/types/cart";

const ProductActions = ({ product, quantity }: ProductActionsProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const setCartItems = useSetRecoilState(cartState);
  const { isWished, toggleWishList } = useWishListWithLocal(product.id);

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

  //찜하기 버튼
  const onClickHeart = () => {
    toggleWishList();
  };

  return (
    <>
      <ul className="flex items-stretch justify-center gap-1 lg:gap-2">
        <li className="w-1/5">
          <ActionButton
            onClick={onClickHeart}
            variant="primary"
            className="w-full flex items-center justify-center h-full"
            aria-label="찜하기"
          >
            {isWished ? (
              <GoHeartFill size={25} className="text-rose-500" />
            ) : (
              <GoHeart size={25} className="text-white" />
            )}
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
          <DirectPaymentButton product={product} quantity={quantity} />
        </li>
      </ul>
      {isDrawerOpen && (
        <AddToCartDrawer isOpen={isDrawerOpen} onClose={onClickCloseDrawer} />
      )}
    </>
  );
};

export default ProductActions;
