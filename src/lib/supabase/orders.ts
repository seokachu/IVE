import { supabase } from "./client";

//결제목록 저장
export const saveOrderItems = async (
  orderItems: {
    order_id: string;
    user_id: string;
    product_id: string;
    product_name: string;
    product_image: string | null;
    price: number;
    quantity: number;
    shipping_type: boolean;
  }[]
) => {
  try {
    const { data, error } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`주문 상품 저장에 실패했습니다: ${error.message}`);
    }
    throw error;
  }
};

//결제데이터 불러오기
export const getOrderItems = async (orderId: string) => {
  try {
    const { data, error } = await supabase
      .from("order_items")
      .select("*")
      .eq("user_id", orderId)
      .order("created_at", { ascending: true })
      .order("id", { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`주문 목록 조회에 실패했습니다: ${error.message}`);
    }
    throw error;
  }
};

//결제정보 - order id로 상세정보 조회
export const getOrderDetail = async (orderId: string) => {
  try {
    const { data, error } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);

    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`주문 상세정보 조회에 실패했습니다. ${error.message}`);
    }
    throw error;
  }
};

//결제목록 삭제
export const deleteOrderItems = async (itemIds: string[]) => {
  try {
    const { data, error } = await supabase
      .from("order_items")
      .delete()
      .in("id", itemIds);

    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`결제목록을 삭제하는데 실패했습니다.${error.message}`);
    }
  }
};

//결제목록 주문 전체 삭제
export const deleteAllOrderItems = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("order_items")
      .delete()
      .eq("user_id", userId);

    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `결제목록을 전체 삭제하는데 실패했습니다.${error.message}`
      );
    }
  }
};

//order 구매 확정 업데이트
export const confirmOrderItem = async (itemId: string) => {
  try {
    const { data, error } = await supabase
      .from("order_items")
      .update({
        is_confirmed: true,
      })
      .eq("id", itemId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`구매 확정에 실패했습니다. ${error.message}`);
    }
  }
};
