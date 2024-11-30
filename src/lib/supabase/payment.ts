import { supabase } from "@/lib/supabase/client";

//결제 데이터 불러오기
export const getPayments = async () => {
  try {
    const { data, error } = await supabase.from("payments").select("*");

    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`결제 정보를 불러오는 데 실패했습니다. ${error.message}`);
    }
    throw error;
  }
};

//결제데이터 저장하기
export const savePayment = async (paymentData: {
  user_id: string;
  order_id: string;
  amount: number;
  order_name: string;
  payment_method: string;
  status: string;
}) => {
  try {
    const { data, error } = await supabase
      .from("payments")
      .insert([paymentData]);

    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `결제 데이터를 저장하는 데 실패했습니다. ${error.message}`
      );
    }
    throw error;
  }
};
