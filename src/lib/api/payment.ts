import axios from "axios";
import { saveOrderItems } from "@/lib/supabase/orders";
import { savePayment } from "@/lib/supabase/payment";
import type {
  OrderItemInput,
  TossPaymentErrorResponse,
  TossPaymentResponse,
} from "@/types/payment";
import type { Tables } from "@/types/supabase";
import type { CartItem } from "@/types/cart";

const PAYMENT_URL = "/api/payment/confirm";

//Toss Payments API
export const confirmTossPayment = async (
  paymentKey: string,
  orderId: string,
  amount: number
): Promise<TossPaymentResponse> => {
  try {
    const { data } = await axios.post(
      PAYMENT_URL,
      {
        paymentKey,
        orderId,
        amount,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        ...(error.response.data as TossPaymentErrorResponse),
        message:
          error.response.data.message || "결제 처리 중 오류가 발생했습니다.",
      };
    }
    throw new Error(
      error instanceof Error
        ? error.message
        : "결제 처리 중 오류가 발생했습니다."
    );
  }
};

//결제정보, 주문상품 정보 저장
export const savePaymentData = async (
  paymentData: Partial<Tables<"payments">>,
  orderItemsData: OrderItemInput[]
): Promise<void> => {
  try {
    //순차적으로 저장
    await savePayment(paymentData);
    await saveOrderItems(orderItemsData);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`${error.message}`);
    }
    throw error;
  }
};

//장바구니 결제 상품
export const cartListItemsToOrderItems = (
  cartItems: CartItem[],
  checkoutItems: (string | CartItem)[],
  userId: string,
  orderId: string
) => {
  //바로구매 버튼과 장바구니 결제 필터링
  const filterCartByCheckoutItems = (item: CartItem) =>
    checkoutItems.some(
      (checkItem) =>
        (typeof checkItem === "string" ? checkItem : checkItem.id) === item.id
    );

  const selectedCartItems: CartItem[] =
    cartItems.length === 0
      ? checkoutItems.filter(
          (item): item is CartItem => typeof item !== "string"
        )
      : cartItems.filter(filterCartByCheckoutItems);

  return selectedCartItems.map((item) => ({
    user_id: userId,
    order_id: orderId,
    product_id: item.id,
    product_name: item.title,
    product_image: item.thumbnail,
    price: Number(item.price),
    quantity: item.quantity,
    shipping_type: item.shipping_type ?? "무료배송",
    discount_rate: item.discount_rate ?? 0,
    review_count: item.review_count ?? 0,
    color: item.color,
    size: item.size,
    delivery_info: item.delivery_info,
    rating: null,
  }));
};

//결제정보 생성
export const createPaymentData = (
  paymentInfo: TossPaymentResponse,
  userId: string,
  orderId: string,
  amount: string,
  orderName: string | null,
  address: Tables<"shipping_addresses">
): Partial<Tables<"payments">> => {
  return {
    user_id: userId,
    order_id: orderId,
    amount: amount,
    order_name: orderName || "",
    payment_method: paymentInfo.easyPay
      ? `${paymentInfo.easyPay.provider} 간편결제`
      : paymentInfo.method || "카드",
    status: "결제 완료",
    installment_months: paymentInfo.card?.installmentPlanMonths || 0,
    recipient_name: address.recipient_name,
    recipient_phone: address.recipient_phone,
    address_line1: address.address_line1,
    address_line2: address.address_line2,
    postal_code: address.postal_code,
    delivery_status: "배송전",
    created_at: paymentInfo.approvedAt,
  };
};
