import { create } from "zustand";

interface UiStore {
  isLoading: boolean;
  isScrolled: boolean;
  actions: {
    setLoading: (isLoading: boolean) => void;
    startLoading: () => void;
    stopLoading: () => void;
    setScrolled: (isScrolled: boolean) => void;
  };
}

const useUiStore = create<UiStore>((set) => ({
  isLoading: false,
  isScrolled: false,
  actions: {
    setLoading: (isLoading) => set({ isLoading }),
    startLoading: () => set({ isLoading: true }),
    stopLoading: () => set({ isLoading: false }),
    setScrolled: (isScrolled) => set({ isScrolled }),
  },
}));

export const useIsLoading = () => useUiStore((state) => state.isLoading);
export const useIsScrolled = () => useUiStore((state) => state.isScrolled);
export const useUiActions = () => useUiStore((state) => state.actions);
