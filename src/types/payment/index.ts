import { Database } from "@/types/supabase";

export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
export type OrderItemInput = Omit<
  OrderItem,
  "created_at" | "id" | "is_confirmed"
>;

export interface TossPaymentResponse {
  status: string;
  approvedAt: string;
  paymentKey: string;
  method?: string;
  card?: {
    installmentPlanMonths: number;
  };
  easyPay?: {
    provider: string;
  };
  message?: string;
  code?: string;
}

export interface TossPaymentErrorResponse {
  code: string;
  message?: string;
  status: string;
  approvedAt: string;
  paymentKey: string;
}
