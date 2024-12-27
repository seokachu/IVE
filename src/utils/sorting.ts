import { Tables } from "@/types/supabase";
import { calculateDiscount } from "./calculateDiscount";
import { SortOptionList } from "@/types";

export const sortItems = (items: Tables<"goods">[], sortBy: SortOptionList) => {
  if (!items?.length) return [];

  let allItems = items.flat();
  const itemsCopy = [...allItems];

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
        if (!a.created_at && !b.created_at) return 0;
        if (!a.created_at) return 1;
        if (!b.created_at) return -1;

        return a.created_at < b.created_at ? 1 : -1;
      });
    case "best":
      return itemsCopy.sort((a, b) => {
        return (b.review_count ?? 0) - (a.review_count ?? 0);
      });
    default:
      return itemsCopy;
  }
};
