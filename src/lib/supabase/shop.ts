import { supabase } from "@/lib/supabase/client";
import { getDiscountedPrice } from "@/utils/calculateDiscount";
import { countRecentReviews } from "@/utils/calculateBadge";
import type { GoodsItem, SortOptionList } from "@/types/shop";

const CAROUSEL_ITEM_COUNT = 12;

//상품 목록 — 리뷰 별점을 조인해 한 번에 조회하고, 리뷰 수·평균 별점을 계산해 담는다
//(목록·캐러셀에서 상품별 리뷰 요청 없이 바로 사용)
export const getGoodsShop = async (): Promise<GoodsItem[]> => {
  const { data, error } = await supabase.from("goods").select(`
      *,
      goods_reviews(rating, created_at)
    `);

  if (error) {
    throw new Error(`상품 목록을 불러오는데 실패했습니다. ${error.message}`);
  }

  return (data ?? []).map(({ goods_reviews, ...item }) => {
    const reviews: { rating: number | null; created_at: string | null }[] = goods_reviews ?? [];
    const ratings = reviews
      .map((review) => review.rating)
      .filter((rating): rating is number => typeof rating === "number");
    const average =
      ratings.length > 0
        ? Math.round((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length) * 10) / 10
        : 0;

    //HOT 뱃지는 누적이 아니라 최근 반응으로 판단한다 (calculateBadge 참고)
    return {
      ...item,
      review_count: reviews.length,
      recent_review_count: countRecentReviews(reviews),
      average_rating: average,
    };
  });
};

//정렬 — 목록은 한 번만 받아오고 정렬은 클라이언트에서 즉시 수행
export const sortGoods = (items: GoodsItem[], sortBy: SortOptionList): GoodsItem[] => {
  const time = (value: string | null) => (value ? new Date(value).getTime() : 0);
  const sorted = [...items];

  switch (sortBy) {
    case "latest":
      return sorted.sort((a, b) => time(b.created_at) - time(a.created_at));
    case "price_low_to_high":
      return sorted.sort((a, b) => getDiscountedPrice(a) - getDiscountedPrice(b));
    case "price_high_to_low":
      return sorted.sort((a, b) => getDiscountedPrice(b) - getDiscountedPrice(a));
    case "best":
    default:
      return sorted.sort(
        (a, b) =>
          b.review_count - a.review_count || b.average_rating - a.average_rating || time(b.created_at) - time(a.created_at),
      );
  }
};

//상품 전체 개수 — 목록 툴바 표기용
export const getGoodsCount = async () => {
  const { count, error } = await supabase.from("goods").select("id", { count: "exact", head: true });

  if (error) {
    throw new Error(`상품 개수를 불러오는데 실패했습니다. ${error.message}`);
  }
  return count ?? 0;
};

//상품 목록 상세정보
export const getGoodsShopDetail = async (id: string) => {
  const { data, error } = await supabase.from("goods").select("*").eq("id", id).single();

  if (error) {
    throw new Error(`상품 정보를 불러오는데 실패했습니다. ${error.message}`);
  }
  return data;
};

//메인페이지 캐러셀 — 베스트 순 상위 12개
export const getCarouselShop = async (): Promise<GoodsItem[]> => {
  const items = await getGoodsShop();
  return sortGoods(items, "best").slice(0, CAROUSEL_ITEM_COUNT);
};
