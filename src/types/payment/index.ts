import type { Tables } from "@/types/supabase";
import type { OrderItem } from "@/types/index";

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

export interface UsePaymentConfirmationProps {
  orderId: string | null;
  paymentKey: string | null;
  amount: string | null;
  orderName: string | null;
  address?: Tables<"shipping_addresses">;
  payment?: Tables<"payments">;
  addressLoading: boolean;
}

export interface UseCartCleanupParams {
  isPaymentComplete: boolean;
}

export interface PaymentButtonProps {
  amount: number;
  orderName: string;
}
