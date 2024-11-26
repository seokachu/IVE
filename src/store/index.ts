import { atom } from "recoil";
import { Session } from "@supabase/supabase-js";
import { cartStorage } from "@/utils/cartStorage";

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
