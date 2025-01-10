import { supabase } from "@/lib/supabase/client";
import type { PaymentInsert } from "@/types";

//결제 데이터 불러오기
export const getPaymentByOrderId = async (orderId: string) => {
  try {
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("order_id", orderId)
      .maybeSingle();

    if (error) throw error;

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `결제 데이터를 불러오는데 실패했습니다. ${error.message}`
      );
    }
    throw error;
  }
};

//결제데이터 저장하기
export const savePayment = async (paymentData: PaymentInsert) => {
  try {
    const { data, error } = await supabase
      .from("payments")
      .insert([paymentData])
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `결제 데이터를 저장하는데 실패했습니다. ${error.message}`
      );
    }
    throw error;
  }
};
