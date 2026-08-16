import { getCarouselShop, getGoodsCount, getGoodsShop, getGoodsShopDetail } from "@/lib/supabase/shop";
import { useQuery } from "@tanstack/react-query";

//상품 목록 — 전체를 한 번만 조회하고 정렬·더보기는 클라이언트에서 처리
export const useShops = () => {
  return useQuery({
    queryKey: ["shops", "list"],
    queryFn: getGoodsShop,
  });
};

//상품 전체 개수
export const useShopsCount = () => {
  return useQuery({
    queryKey: ["shops", "count"],
    queryFn: getGoodsCount,
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
