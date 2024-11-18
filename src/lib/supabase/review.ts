import { supabase } from "@/lib/supabase/client";

export const getGoodsReviews = async (goodsId: string) => {
  try {
    const { data, error } = await supabase
      .from("goods_review")
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
