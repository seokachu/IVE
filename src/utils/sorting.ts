import { Tables } from "@/types/supabase";
import { calculateDiscount } from "./calculateDiscount";
import { SortOptionList } from "@/types";

export const sortItems = (items: Tables<"goods">[], sortBy: SortOptionList) => {
  const itemsCopy = [...items];

  const getSafeDate = (date: string | null): number => {
    if (!date) return 0;
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? 0 : parsedDate.getTime();
  };

  switch (sortBy) {
    case "price_low_to_high":
    case "price_high_to_low": {
      return itemsCopy.sort((a, b) => {
        const priceA = calculateDiscount(a.price, a.discount_rate);
        const priceB = calculateDiscount(b.price, b.discount_rate);

        return sortBy === "price_low_to_high"
          ? priceA - priceB
          : priceB - priceA;
      });
    }
    case "latest":
      return itemsCopy.sort((a, b) => {
        return getSafeDate(b.created_at) - getSafeDate(a.created_at);
      });
    case "best":
      return itemsCopy.sort((a, b) => {
        return (b.review_count ?? 0) - (a.review_count ?? 0);
      });
    default:
      return itemsCopy;
  }
};
