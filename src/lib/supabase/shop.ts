import { supabase } from "@/lib/supabase/client";

const ITEM_PAGE = 12;

//상품 목록
export const getGoodsShop = async (page = 1) => {
  try {
    const { data, error } = await supabase
      .from("goods")
      .select("*")
      .range((page - 1) * ITEM_PAGE, page * ITEM_PAGE - 1);

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
