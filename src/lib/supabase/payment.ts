import { supabase } from "@/lib/supabase/client";
import type { PaymentInsert } from "@/types";

//결제 데이터 불러오기
export const getPaymentByOrderId = async (orderId: string) => {
  try {
    const { data, error } = await supabase.from("payments").select("*").eq("order_id", orderId).maybeSingle();

    if (error) throw error;

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`결제 데이터를 불러오는데 실패했습니다. ${error.message}`);
    }
    throw error;
  }
};

export interface OrderPaymentSummary {
  amount: number;
  deliveryStatus: string | null;
}

//주문 id 목록의 실제 결제 금액·배송 상태 맵 — 결제 내역 요약이 멤버십 할인 반영액과 일치하도록
export const getPaymentSummariesByOrderIds = async (
  orderIds: string[]
): Promise<Record<string, OrderPaymentSummary>> => {
  if (orderIds.length === 0) return {};

  const { data, error } = await supabase
    .from("payments")
    .select("order_id, amount, delivery_status")
    .in("order_id", orderIds);

  if (error) return {};
  return Object.fromEntries(
    (data || []).map((row) => [row.order_id, { amount: Number(row.amount), deliveryStatus: row.delivery_status }])
  );
};

//결제데이터 저장하기
export const savePayment = async (paymentData: PaymentInsert) => {
  try {
    const { data, error } = await supabase.from("payments").insert([paymentData]).select();

    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`결제 데이터를 저장하는데 실패했습니다. ${error.message}`);
    }
    throw error;
  }
};
