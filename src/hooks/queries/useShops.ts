import { getGoodsShop, getGoodsShopDetail } from "@/lib/supabase/shop";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { SortOptionList } from "@/types";

//상품 목록 정렬
export const useShops = (sortBy: SortOptionList) => {
  return useInfiniteQuery({
    queryKey: ["shops", sortBy],
    queryFn: ({ pageParam = 1 }) => getGoodsShop(pageParam, sortBy),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) return undefined;
      return allPages.length + 1;
    },
  });
};

//찜 목록 특정 상품 정보 가져오기
export const useShopLists = (productId?: string | null | undefined) => {
  return useQuery({
    queryKey: ["shops", productId],
    queryFn: () => getGoodsShopDetail(productId!),
    enabled: !!productId,
  });
};

//상품 상세
export const useShop = (id: string) => {
  return useQuery({
    queryKey: ["shop", id],
    queryFn: () => getGoodsShopDetail(id),
    enabled: !!id,
  });
};
