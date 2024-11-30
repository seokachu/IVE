import { supabase } from "@/lib/supabase/client";

//배송지 목록 조회
export const getShippingAddress = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("shipping_addresses")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    return null; // 배송지가 없는 경우
  }
};

// 배송지 저장하기
export const saveShippingAddress = async (addressData: {
  user_id: string;
  recipient_name: string;
  recipient_phone: string;
  postal_code: string;
  address_line1: string;
  address_line2: string;
}) => {
  try {
    const { data, error } = await supabase
      .from("shipping_addresses")
      .upsert(addressData) // 이미 있으면 업데이트하고, 없으면 새로 생성 로직
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`배송지 저장에 실패했습니다: ${error.message}`);
    }
    throw error;
  }
};
