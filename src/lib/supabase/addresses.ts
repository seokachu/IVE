import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

// 타입 정의
type ShippingAddressUpdate =
  Database["public"]["Tables"]["shipping_addresses"]["Update"];
type ShippingAddressInsert =
  Database["public"]["Tables"]["shipping_addresses"]["Insert"];

//배송지 목록 조회 (여러개)
export const getShippingAddresses = async (userId: string) => {
  try {
    if (!userId) return null;

    const { data, error } = await supabase
      .from("shipping_addresses")
      .select("*")
      .eq("user_id", userId)
      .order("is_default", { ascending: false }) //기본배송지 설정
      .order("created_at", { ascending: false }); //최근 등록순

    if (error) throw error;
    return data || [];
  } catch (error) {
    return [];
  }
};

//단일 배송지 조회
export const getShippingAddress = async (addressId: string) => {
  try {
    const { data, error } = await supabase
      .from("shipping_addresses")
      .select("*")
      .eq("id", addressId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`배송지를 가져오는 데 실패했습니다. ${error.message}`);
    }
  }
};

// 배송지 저장하기
export const saveShippingAddress = async (
  addressData: ShippingAddressInsert
) => {
  const { user_id, is_default } = addressData;

  try {
    //기존 모든 배송지 해제
    if (is_default) {
      const { error: updateError } = await supabase
        .from("shipping_addresses")
        .update({ is_default: false })
        .eq("user_id", user_id)
        .eq("is_default", true);

      if (updateError) throw updateError;
    }

    //새 배송지 추가
    const { data, error } = await supabase
      .from("shipping_addresses")
      .insert(addressData)
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

//배송지 수정하기
export const updateShippingAddress = async (
  addressId: string,
  addressData: ShippingAddressUpdate
) => {
  const { user_id } = addressData;

  try {
    // 기본배송지 설정
    const { error } = await supabase.rpc("set_default_address", {
      p_address_id: addressId,
      p_user_id: user_id,
    });
    if (error) throw error;

    // 업데이트된 데이터 조회
    const { data: updatedData, error: fetchError } = await supabase
      .from("shipping_addresses")
      .select()
      .eq("id", addressId)
      .single();

    if (fetchError) throw fetchError;
    return updatedData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`배송지 수정에 실패했습니다: ${error.message}`);
    }
    throw error;
  }
};

// 배송지 삭제하기
export const deleteShippingAddress = async (addressId: string) => {
  try {
    const { error } = await supabase
      .from("shipping_addresses")
      .delete()
      .eq("id", addressId);

    if (error) throw error;
    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`배송지 삭제에 실패했습니다: ${error.message}`);
    }
    throw error;
  }
};
