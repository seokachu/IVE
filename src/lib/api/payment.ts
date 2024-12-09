import axios from "axios";

interface PaymentConfirmParams {
  paymentKey: string;
  orderId: string;
  amount: number;
}

interface PaymentInfo {
  status: string;
  easyPay?: {
    provider: string;
  };
  method?: string;
  card?: {
    installmentPlanMonths: number;
  };
  approvedAt: string;
}

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PAYMENT_CONFIRM_URL,
});

export const getAuthHeader = () => ({
  Authorization: `Basic ${Buffer.from(
    `${process.env.NEXT_PUBLIC_TOSS_SECRET_KEY}:`
  ).toString("base64")}`,
  "Content-Type": "application/json",
});

export const confirmPayment = async (
  params: PaymentConfirmParams
): Promise<PaymentInfo> => {
  const { data } = await apiClient.post("/", params, {
    headers: getAuthHeader(),
  });
  return data;
};
