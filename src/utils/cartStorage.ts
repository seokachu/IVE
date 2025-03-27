import type { CartItem } from "@/types/cart";

export const cartStorage = {
  getCart: (): CartItem[] => {
    if (typeof window === "undefined") return [];
    const cart = localStorage.getItem("shopping_cart");
    return cart ? JSON.parse(cart) : [];
  },

  //현재 장바구니에 담긴 특정 상품의 수량을 확인하는 함수
  getItemQuantity: (itemId: string): number => {
    const currentCart = cartStorage.getCart();
    const existingItem = currentCart.find((item) => item.id === itemId);
    return existingItem?.quantity || 0;
  },

  addItem: (item: CartItem) => {
    const currentCart = cartStorage.getCart();
    const existingItem = currentCart.find((cartItem) => cartItem.id === item.id);

    //현재 장바구니에 담긴 수량 + 새로 담을 수량이 5개를 초과하는지 체크
    const currentQuantity = existingItem?.quantity || 0;
    const newTotalQuantity = currentQuantity + item.quantity;

    if (newTotalQuantity > 5) {
      throw new Error("최대 구매 가능 수량은 5개입니다.");
    }

    let newCart;
    if (existingItem) {
      newCart = currentCart.map((cartItem) =>
        cartItem.id === item.id ? { ...cartItem, quantity: newTotalQuantity } : cartItem,
      );
    } else {
      newCart = [...currentCart, item];
    }

    localStorage.setItem("shopping_cart", JSON.stringify(newCart));
    return newCart;
  },
};
