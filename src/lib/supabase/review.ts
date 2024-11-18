import { supabase } from "@/lib/supabase/client";

export const getGoodsReviews = async (goodsId: string) => {
  try {
    const { data, error } = await supabase
      .from("goods_reviews")
      .select("*")
      .eq("goods_id", goodsId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`리뷰 정보를 가져오는 데 실패했습니다. ${error.message}`);
    }
    throw error;
  }
};

//리뷰 평균
export const getAverageRating = async (goodsId: string) => {
  const { data, error } = await supabase
    .from("goods_reviews")
    .select("rating")
    .eq("goods_id", goodsId);
  if (error) throw error;

  if (!data || data.length === 0) return 0;

  const average =
    data.reduce((sum, review) => sum + review.rating, 0) / data.length;
  return Number(average.toFixed(1));
};
