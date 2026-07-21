import { create } from "zustand";
import { cartStorage } from "@/utils/cartStorage";
import type { CartItem } from "@/types/cart";

interface CartStore {
  cartItems: CartItem[];
  actions: {
    setCartItems: (cartItems: CartItem[]) => void;
    resetCart: () => void;
  };
}

const useCartStore = create<CartStore>((set) => ({
  cartItems: cartStorage.getCart(),
  actions: {
    setCartItems: (cartItems) => set({ cartItems }),
    resetCart: () => set({ cartItems: [] }),
  },
}));

export const useCartItems = () => useCartStore((state) => state.cartItems);
export const useCartActions = () => useCartStore((state) => state.actions);
