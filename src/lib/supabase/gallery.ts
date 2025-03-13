import { supabase } from "@/lib/supabase/client";
import { GALLERY_DEFAULT_LIMIT } from "@/utils/constants";

//데이터 불러오기 (6개)
export const getGallery = async (limit = GALLERY_DEFAULT_LIMIT) => {
  try {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `갤러리 목록을 가져오는데 실패했습니다. ${error.message}`
      );
    }
    throw error;
  }
};
