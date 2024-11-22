import { getGoodsShop, getGoodsShopDetail } from "@/lib/supabase/shop";
import { useQuery } from "@tanstack/react-query";
import type { SortOptionList } from "@/types";

//상품 목록
export const useShops = (sortBy: SortOptionList) => {
  return useQuery({
    queryKey: ["shops", sortBy],
    queryFn: () => getGoodsShop(),
  });
};

//상품 상세
export const useShop = (id: string) => {
  return useQuery({
    queryKey: ["shop", id],
    queryFn: () => getGoodsShopDetail(id),
  });
};
