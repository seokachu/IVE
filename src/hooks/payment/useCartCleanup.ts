"use client";

import { useCartActions, useCartItems } from "@/store/zustand";
import type { CartItem } from "@/types/cart";
import type { UseCartCleanupParams } from "@/types/payment";

export const useCartCleanup = ({ isPaymentComplete }: UseCartCleanupParams) => {
  const cartItems = useCartItems();
  const { setCartItems } = useCartActions();

  const cleanupCart = (checkoutItems: (string | CartItem)[]) => {
    if (!isPaymentComplete || !checkoutItems.length) return;

    //장바구니에서 결제 완료된 상품 제거
    const updatedCart = cartItems.filter(
      (item) =>
        !checkoutItems.some((checkItem) => (typeof checkItem === "string" ? checkItem : checkItem.id) === item.id),
    );

    //로컬 스토리지와 Zustand 상태 업데이트
    localStorage.setItem("shopping_cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);

    //결제 아이템 정보 삭제
    localStorage.removeItem("checkout_items");
  };

  const getCheckoutItems = (): (string | CartItem)[] => {
    try {
      return JSON.parse(localStorage.getItem("checkout_items") || "[]");
    } catch (error) {
      console.error("결제 아이템 정보를 가져오는 중 오류가 발생했습니다.", error);
      return [];
    }
  };

  return {
    cleanupCart,
    getCheckoutItems,
  };
};

export default useCartCleanup;
