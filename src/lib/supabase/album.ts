import { supabase } from "@/lib/supabase/client";

export const getAlbums = async () => {
  try {
    const { data, error } = await supabase
      .from("album")
      .select("*")
      .order("date", { ascending: false });
    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
};
