import { atom } from "recoil";
import { Session } from "@supabase/supabase-js";

export const sessionState = atom<Session | null>({
  key: "sessionState",
  default: null,
});
