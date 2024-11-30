import { supabase } from "@/lib/supabase/client";

//상품 목록
export const getGoodsShop = async () => {
  try {
    const { data, error } = await supabase.from("goods").select("*").limit(20);

    if (error) throw error;
    return data;
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
