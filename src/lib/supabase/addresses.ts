import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

//타입 정의
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
    // 새 배송지 추가
    const { data, error } = await supabase
      .from("shipping_addresses")
      .insert(addressData) // 원본 데이터 그대로 사용하기
      .select()
      .single();

    if (error) throw error;

    //is_default가 true일 때만 RPC 호출
    if (is_default) {
      const { error: rpcError } = await supabase.rpc("set_default_address", {
        p_address_id: data.id,
        p_user_id: user_id,
      });

      if (rpcError) throw rpcError;
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// 배송지 수정하기
export const updateShippingAddress = async (
  addressId: string,
  addressData: ShippingAddressUpdate
) => {
  const { user_id } = addressData;

  try {
    //먼저 해당 주소를 true로 업데이트
    const { error: updateError } = await supabase
      .from("shipping_addresses")
      .update({ is_default: true })
      .eq("id", addressId);

    if (updateError) throw updateError;

    //rpc 호출로 다른 주소들을 false로
    const { error } = await supabase.rpc("set_default_address", {
      p_address_id: addressId,
      p_user_id: user_id,
    });

    if (error) throw error;

    const { data: updatedData, error: fetchError } = await supabase
      .from("shipping_addresses")
      .select()
      .eq("id", addressId)
      .single();

    if (fetchError) throw fetchError;
    return updatedData;
  } catch (error) {
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
