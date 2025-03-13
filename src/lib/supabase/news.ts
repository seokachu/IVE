import { supabase } from "@/lib/supabase/client";

export const getNewsGallery = async () => {
  try {
    const { data, error } = await supabase
      .from("news_gallery")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`뉴스 목록을 가져오는데 실패했습니다. ${error.message}`);
    }
    throw error;
  }
};
