import { supabase } from "@/lib/supabase/client";

export const getGoodsShop = async () => {
  try {
    const { data, error } = await supabase
      .from("goods")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`상품 정보를 불러오는 데 실패했습니다. ${error.message}`);
    }
    throw error;
  }
};
