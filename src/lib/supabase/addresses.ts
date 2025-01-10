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
    if (error instanceof Error) {
      throw new Error(
        `배송지 목록을 가져오는 데 실패했습니다. ${error.message}`
      );
    }
    return [];
  }
};

//단일 배송지 조회
export const getShippingAddress = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("shipping_addresses")
      .select("*")
      .eq("user_id", userId)
      .eq("is_default", true)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`배송지를 가져오는 데 실패했습니다. ${error.message}`);
    }
    throw error;
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
    if (error instanceof Error) {
      throw new Error(`배송지를 저장하는데 실패헀습니다. ${error.message}`);
    }
    throw error;
  }
};

// 배송지 삭제하기
export const deleteShippingAddress = async (addressId: string) => {
  try {
    //삭제하려고 하는 배송지 정보 조회
    const { data: addressToDelete, error: fetchError } = await supabase
      .from("shipping_addresses")
      .select("*")
      .eq("id", addressId)
      .single();

    if (fetchError) throw fetchError;

    //삭제 실행
    const { error: deleteError } = await supabase
      .from("shipping_addresses")
      .delete()
      .eq("id", addressId);

    if (deleteError) throw deleteError;

    //삭제한 배송지가 기본 배송지면
    if (addressToDelete.is_default) {
      //RPC 호출로 새로운 기본 배송지 설정
      const { error: rpcError } = await supabase.rpc("update_default_address", {
        p_user_id: addressToDelete.user_id,
      });

      if (rpcError) {
        if (rpcError instanceof Error) {
          throw new Error(
            `기본배송지를 재설정하는데 실패했습니다. ${rpcError.message}`
          );
        }
        throw rpcError;
      }
    }

    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`배송지를 삭제하는데 실패했습니다. ${error.message}`);
    }
    throw error;
  }
};

// 배송지 수정하기
export const updateShippingAddress = async (
  addressId: string,
  addressData: ShippingAddressUpdate
) => {
  try {
    // 업데이트 실행
    const { error: updateError } = await supabase
      .from("shipping_addresses")
      .update(addressData)
      .eq("id", addressId);

    if (updateError) {
      if (updateError instanceof Error) {
        throw new Error(
          `배송지 정보 수정에 실패했습니다. ${updateError.message}`
        );
      }
      throw updateError;
    }

    // 업데이트 된 데이터 가져오기
    const { data: afterUpdate } = await supabase
      .from("shipping_addresses")
      .select()
      .eq("id", addressId)
      .single();

    // 기본 배송지로 설정된 경우
    if (addressData.is_default) {
      const { error: rpcError } = await supabase.rpc("set_default_address", {
        p_address_id: addressId,
        p_user_id: addressData.user_id,
      });

      if (rpcError) {
        if (rpcError instanceof Error) {
          throw new Error(
            `기본 배송지 설정에 실패했습니다. ${rpcError.message}`
          );
        }
        throw rpcError;
      }
    }
    return afterUpdate;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`배송지를 수정하는데 실패했습니다. ${error.message}`);
    }
    throw error;
  }
};
