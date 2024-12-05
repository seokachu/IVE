import { supabase } from "./client";
import type { Database } from "@/types/supabase";

type CustomerInfoInsert =
  Database["public"]["Tables"]["customer_info"]["Insert"];

export const getCustomerInfo = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("customer_info")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting customer info:", error);
    throw error;
  }
};

export const saveCustomerInfo = async (info: CustomerInfoInsert) => {
  try {
    const { data, error } = await supabase
      .from("customer_info")
      .upsert(info, {
        onConflict: "user_id",
        ignoreDuplicates: false, // 중복을 무시하지 않고 업데이트
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving customer info:", error);
    throw error;
  }
};
