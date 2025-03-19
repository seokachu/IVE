import { Database, Tables } from "@/types/supabase";

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

export interface PaymentSuccessViewProps {
  orderItems: Tables<"order_items">[];
  payment: Tables<"payments">;
}

export interface PaymentSuccessHeaderProps {
  orderId: string | null;
}

export interface OrderItemsListProps {
  orderItems: Tables<"order_items">[];
}
