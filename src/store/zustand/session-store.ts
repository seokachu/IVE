import type { Session } from "@supabase/supabase-js";
import { create } from "zustand";

interface SessionStore {
  session: Session | null;
  actions: {
    setSession: (session: Session | null) => void;
    clearSession: () => void;
  };
}

const useSessionStore = create<SessionStore>((set) => ({
  session: null,
  actions: {
    setSession: (session) => set({ session }),
    clearSession: () => set({ session: null }),
  },
}));

export const useSession = () => useSessionStore((state) => state.session);
export const useSessionActions = () => useSessionStore((state) => state.actions);
