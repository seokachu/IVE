import { supabase } from "@/lib/supabase/client";
import { DEFAULT_LIMIT } from "@/utils/constants";
import type { NewsItem } from "@/types";

//news 데이터 가져오기
export const getNewsGallery = async (
  limit = DEFAULT_LIMIT
): Promise<NewsItem[]> => {
  try {
    const { data, error } = await supabase
      .from("news_gallery")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`뉴스 목록을 가져오는데 실패했습니다. ${error.message}`);
    }
    throw error;
  }
};

//news detail 페이지
export const getNewsGalleryById = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("news_gallery")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `뉴스 상세 정보를 가져오는데 실패했습니다. ${error.message}`
      );
    }
  }
};
