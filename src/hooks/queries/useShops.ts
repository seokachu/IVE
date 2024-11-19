import { getGoodsShop, getGoodsShopDetail } from "@/lib/supabase/shop";
import { useQuery } from "@tanstack/react-query";

//상품 목록
export const useShops = () => {
  return useQuery({
    queryKey: ["shops"],
    queryFn: getGoodsShop,
  });
};

//상품 상세
export const useShop = (id: string) => {
  return useQuery({
    queryKey: ["shop", id],
    queryFn: () => getGoodsShopDetail(id),
  });
};
