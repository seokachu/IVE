import { supabase } from "@/lib/supabase/client";
import type { SortOptionList } from "@/types";

const ITEM_PAGE = 12;

//상품 목록
export const getGoodsShop = async (
  page = 1,
  sortBy: SortOptionList = "best"
) => {
  try {
    let query = supabase.from("goods").select(`
        *,
        goods_reviews(rating)
      `);

    const { data, error } = await query;

    if (error) {
      if (error instanceof Error) {
        throw new Error(
          `리뷰 목록을 불러오는데 실패했습니다. ${error.message}`
        );
      }
      throw error;
    }

    // 정렬 로직
    let sortedData = [...(data || [])];

    switch (sortBy) {
      case "latest":
        sortedData.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "price_low_to_high":
        sortedData.sort((a, b) => a.price - b.price);
        break;
      case "price_high_to_low":
        sortedData.sort((a, b) => b.price - a.price);
        break;
      case "best":
        sortedData.sort(
          (a, b) =>
            (b.goods_reviews?.length || 0) - (a.goods_reviews?.length || 0)
        );
        break;
      default:
        sortedData.sort(
          (a, b) =>
            (b.goods_reviews?.length || 0) - (a.goods_reviews?.length || 0)
        );
    }

    // 페이지네이션 적용
    const start = (page - 1) * ITEM_PAGE;
    const end = start + ITEM_PAGE;
    const paginatedData = sortedData.slice(start, end);

    return paginatedData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`상품 정보를 불러오는데 실패했습니다. ${error.message}`);
    }
    throw error;
  }
};

//상품 목록 상세정보
export const getGoodsShopDetail = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("goods")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`상품 정보를 불러오는데 실패했습니다. ${error.message}`);
    }
    throw error;
  }
};
