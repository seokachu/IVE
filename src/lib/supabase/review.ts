import { supabase } from "@/lib/supabase/client";

export const getGoodsReviews = async (goodsId: string, page: number) => {
  const itemsPerPage = 5;
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  try {
    //전체 개수 가져오기
    const { count } = await supabase
      .from("goods_reviews")
      .select("*", { count: "exact", head: true })
      .eq("goods_id", goodsId);

    //페이지 데이터 가져오기
    const { data, error } = await supabase
      .from("goods_reviews")
      .select(
        `*,
        user:user_id(
        name
        )
        `
      )
      .eq("goods_id", goodsId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      reviews: data || [],
      totalCount: count || 0,
    };
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
