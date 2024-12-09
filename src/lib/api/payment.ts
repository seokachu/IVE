import axios from "axios";
import type { PaymentConfirmParams, PaymentInfo } from "@/types";

const apiClient = axios.create({
  baseURL: "https://api.tosspayments.com",
  headers: {
    Authorization: `Basic ${Buffer.from(
      `${process.env.NEXT_PUBLIC_TOSS_SECRET_KEY}:`
    ).toString("base64")}`,
    "Content-Type": "application/json",
  },
});

export const confirmPayment = async (
  params: PaymentConfirmParams
): Promise<PaymentInfo> => {
  try {
    const { data } = await apiClient.post("/v1/payments/confirm", params);
    console.log("axios data", data);
    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Payment Error Details:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "결제 처리 중 오류가 발생했습니다."
      );
    }
    throw error;
  }
};
