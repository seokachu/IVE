import { ButtonHTMLAttributes } from "react";
import { Database, Tables } from "@/types/supabase";

export interface GnbArrayList {
  label: string;
  path: string;
}

export interface SignInProps {
  title?: string;
  className?: ButtonHTMLAttributes<HTMLButtonElement>["className"];
}

export interface classNameProps {
  className?: ButtonHTMLAttributes<HTMLButtonElement>["className"];
}

export type OAuthProvider = "google" | "github" | "kakao";

export interface AlbumItemProps {
  album: Tables<"album">;
}

type ShopListItem = Database["public"]["Tables"]["goods"]["Row"];

export interface CartItem extends Omit<ShopListItem, "quantity"> {
  quantity: number;
}

export type ItemVariant = "shop" | "carousel";

export interface ShopListItemProps {
  item: ShopListItem;
  variant?: ItemVariant;
}

export interface DiscountedPrice {
  price: number;
  discount_rate?: number | null;
}

export type PriceKeys = "price" | "discount_rate";

export interface GoodsIncludeRating extends ShopListItem {
  rating?: number;
}

export type BadgeFields = Pick<
  GoodsIncludeRating,
  "shipping_type" | "review_count" | "rating" | "id"
>;

export interface BadgeItemProps {
  item: BadgeFields;
  averageRating: number;
}

export type SortOptionList =
  | "best"
  | "latest"
  | "price_low_to_high"
  | "price_high_to_low";

export interface SortOption {
  column: string;
  ascending: boolean;
}

export interface SortProps {
  sort: SortOptionList;
}

export interface TabMenuProps {
  activeTab: "description" | "review";
  setActiveTab: (tab: "description" | "review") => void;
  id: string;
}

export type ShopMenuProps = Pick<ShopListItem, "id">;

export interface ReviewItemProps {
  item: ReviewItem;
}

export interface ReviewItem {
  id: string;
  rating: number;
  content: string;
  created_at: string;
  user: {
    name: string;
  };
}

export interface ReviewResponse {
  reviews: ReviewItem[];
  totalCount: number;
}

export interface ProductActionsProps {
  product: ShopListItem;
  quantity: number;
}

export interface CartListItemProps {
  item: CartItem;
}

//장바구니 약관동의 page checkbox
export type AgreementType = "main" | "privacy" | "refund";
export type ModalType = "privacy" | "refund" | null;

//마이페이지 배송지정보 form
export interface AddressChange {
  zonecode: string;
  fullAddress: string;
}

export interface AddressListProps {
  addresses: Tables<"shipping_addresses">[];
}

export interface AddressListItems {
  item: Tables<"shipping_addresses">;
}

export interface CustomerInfoFormProps {
  initialData?: Tables<"customer_info">;
  defaultValues?: {
    name?: string;
    email?: string;
  };
  onSuccess: () => void;
}

export interface PaymentButtonProps {
  amount: number;
  orderName: string;
}

export interface OrderListItemProps {
  item: Tables<"order_items">;
}

export interface PaymentDetailsProps {
  item: Tables<"payments">;
}

export interface PaymentOverviewProps {
  title: string;
  payment: Tables<"payments">;
}

export interface PaymentConfirmParams {
  paymentKey: string;
  orderId: string;
  amount: number;
}

export interface PaymentInfo {
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

export interface Address {
  recipient_name: string;
  recipient_phone: string;
  address_line1: string;
  address_line2: string;
  postal_code: string;
}

export interface OrderSummaryProps {
  order: {
    orderId: string;
    totalAmount: number;
    itemCount: number;
    orderDate: string;
    firstItemName: string;
    firstOrderImage: string;
  };
}

export interface OrderDetailProps {
  orderItems: Tables<"order_items">[];
  onBack: () => void;
}

export interface OrderDetailPageProps {
  params: {
    orderId: string;
  };
}

export interface DetailOrderItemProps {
  item: Tables<"order_items">;
  onConfirm: () => void;
}

export interface ReviewFormData {
  rating: number;
  content: string;
}

export interface WriteReviewFormProps {
  mode: "create" | "edit";
  reviewData?: Tables<"goods_reviews">;
  onClose: () => void;
  orderId: string;
  goodsId: string;
}

export type WishListItem = Database["public"]["Tables"]["wish_lists"]["Row"];

export interface UserWishListItemProps {
  item: Tables<"wish_lists">;
}

export interface DirectPaymentButtonProps {
  product: ShopListItem;
  quantity: number;
}

export interface UseReviewsProps {
  id: string;
  page: number;
}
