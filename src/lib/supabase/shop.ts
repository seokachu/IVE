import { supabase } from "@/lib/supabase/client";
import type { SortOptionList } from "@/types";
import { SORT_OPTIONS } from "@/utils/constants";

//상품 목록
export const getGoodsShop = async (sortBy: SortOptionList) => {
  try {
    const sortOption = SORT_OPTIONS[sortBy];

    if (!sortOption) {
      throw new Error(`sortBy error : ${sortBy}`);
    }

    const { data, error } = await supabase
      .from("goods")
      .select("*")
      .order(sortOption.column, { ascending: sortOption.ascending })
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
      throw new Error(`상품 정보를 불러오는 데 실패했습니다. ${error.message}`);
    }
    throw error;
  }
};
