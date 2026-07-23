import { create } from "zustand";
import type { AgreementType, CartItem } from "@/types/cart";

interface AgreementsState {
  main: boolean;
  privacy: boolean;
  refund: boolean;
}

interface CheckoutStore {
  agreements: AgreementsState;
  selectedItemIds: CartItem["id"][];
  actions: {
    setAgreement: (key: AgreementType, checked: boolean) => void;
    setAgreements: (agreements: AgreementsState) => void;
    resetAgreements: () => void;
    setSelectedItemIds: (selectedItemIds: CartItem["id"][]) => void;
    resetSelectedItemIds: () => void;
  };
}

const defaultAgreements: AgreementsState = {
  main: false,
  privacy: false,
  refund: false,
};

const useCheckoutStore = create<CheckoutStore>((set) => ({
  agreements: defaultAgreements,
  selectedItemIds: [],
  actions: {
    setAgreement: (key, checked) =>
      set((state) => ({
        agreements: {
          ...state.agreements,
          [key]: checked,
        },
      })),
    setAgreements: (agreements) => set({ agreements }),
    resetAgreements: () => set({ agreements: defaultAgreements }),
    setSelectedItemIds: (selectedItemIds) => set({ selectedItemIds }),
    resetSelectedItemIds: () => set({ selectedItemIds: [] }),
  },
}));

export const useAgreements = () => useCheckoutStore((state) => state.agreements);
export const useSelectedItemIds = () => useCheckoutStore((state) => state.selectedItemIds);
export const useCheckoutActions = () => useCheckoutStore((state) => state.actions);
