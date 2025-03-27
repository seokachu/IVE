import { supabase } from "@/lib/supabase/client";

export const getAlbums = async () => {
  try {
    const { data, error } = await supabase.from("album").select("*").order("date", { ascending: false });
    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`앨범 데이터를 불러오는 데 실패했습니다. ${error.message}`);
    }
    throw error;
  }
};
