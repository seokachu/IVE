import { atom } from "recoil";
import { Session } from "@supabase/supabase-js";
import { cartStorage } from "@/utils/cartStorage";
import type { CartItem } from "@/types";

export const sessionState = atom<Session | null>({
  key: "sessionState",
  default: null,
});

export const loadingState = atom({
  key: "loadingState",
  default: false,
});

export const cartState = atom({
  key: "cartState",
  default: cartStorage.getCart(),
});

export const agreementsState = atom({
  key: "agreementsState",
  default: {
    main: false,
    privacy: false,
    refund: false,
  },
});

export const selectedItemState = atom<CartItem["id"][]>({
  key: "selectedItemsState",
  default: [],
});
