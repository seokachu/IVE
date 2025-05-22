import { getCarouselShop, getGoodsShop, getGoodsShopDetail } from "@/lib/supabase/shop";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { SortOptionList } from "@/types/shop";

//상품 목록 정렬
export const useShops = (sortBy: SortOptionList) => {
  return useInfiniteQuery({
    queryKey: ["shops", "list", sortBy],
    queryFn: ({ pageParam = 1 }) => getGoodsShop(pageParam, sortBy),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) return undefined;
      return allPages.length + 1;
    },
  });
};

//상품 상세 정보
export const useShopDetail = (id: string) => {
  return useQuery({
    queryKey: ["shops", "detail", id],
    queryFn: () => getGoodsShopDetail(id),
    enabled: !!id,
  });
};

//메인페이지 상품목록 불러오기
export const useShopCarousel = () => {
  return useQuery({
    queryKey: ["shops", "carousel"],
    queryFn: getCarouselShop,
  });
};

//마이페이지 찜 목록 정보 가져오기
export const useWishListItem = (productId?: string | null | undefined) => {
  return useQuery({
    queryKey: ["shops", "wishlist", productId],
    queryFn: () => getGoodsShopDetail(productId!),
    enabled: !!productId,
  });
};
