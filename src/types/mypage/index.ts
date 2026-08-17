import type { Tables } from "../supabase";

export interface OrderListItemProps {
  item: Tables<"order_items">;
}

export interface PaymentDetailsProps {
  item: Tables<"payments">;
}

export interface UserWishListProps {
  wishlists: Tables<"wish_lists">[];
}

export interface UserWishListItemProps {
  item: Tables<"wish_lists">;
  index: number;
}

export interface OrderSummaryProps {
  order: {
    orderId: string;
    totalAmount: number;
    itemCount: number;
    orderDate: string;
    firstItemName: string;
    firstOrderImage: string;
    isAllConfirmed: boolean;
  };
}

export interface OrderDetailPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export interface OrderDetailProps {
  orderItems: Tables<"order_items">[];
  onBack: () => void;
}

export interface DetailOrderItemProps {
  item: Tables<"order_items">;
  onConfirm: () => void;
  isLast?: boolean;
}

export interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewData?: Tables<"goods_reviews"> | null;
  orderId: string;
  goodsId: string;
  mode: "create" | "edit";
  productName?: string;
  productImage?: string | null;
  productOption?: string;
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

export interface MyPageBoards extends Tables<"board"> {
  user: {
    id: string;
    name: string;
    avatar_url: string;
  };
  board_comments: { count: number }[];
  board_likes: { count: number }[];
}

export interface PaymentOverviewProps {
  title: string;
  payment: Tables<"payments">;
}

export interface PostListItemProps {
  item: MyPageBoards;
  isLast?: boolean;
}

export interface PostListProps {
  posts?: MyPageBoards[];
}

export interface AddressListProps {
  addresses: Tables<"shipping_addresses">[];
}

export interface AddressListItems {
  item: Tables<"shipping_addresses">;
}

export interface AddressEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  addressData: Tables<"shipping_addresses">;
}

export type AddressFormProps = {
  mode?: "create" | "edit";
  initialData?: Tables<"shipping_addresses">;
  onClose?: () => void;
};

export interface AddressLocationProps {
  searchAddress: () => void;
  detailAddress: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface RequestInfoProps {
  request: (value: string) => void;
  showRequested: boolean;
}

export interface DefaultAddressCheckboxProps {
  isDefaultAddress?: boolean;
}

export interface UseAddressFormProps {
  mode: "create" | "edit";
  initialData?: Tables<"shipping_addresses">;
  isFirstAddress: boolean;
}

export interface AddressChange {
  zonecode: string;
  fullAddress: string;
}

//DIVE 멤버십 — free는 행 없음(기본값), plus/vip는 memberships 테이블 행
export type MembershipTier = "free" | "plus" | "vip";

//클라이언트용 멤버십 행 — billing_key·customer_key는 컬럼 권한으로 차단되어 서버에서만 접근
export interface MembershipRow {
  id: string;
  user_id: string;
  tier: Exclude<MembershipTier, "free">;
  status: "active" | "canceled";
  price: number;
  card_company: string | null;
  card_number: string | null;
  started_at: string;
  next_billing_at: string;
  canceled_at: string | null;
  created_at: string;
}

export interface MembershipPlan {
  tier: MembershipTier;
  name: string;
  price: number;
  benefits: string[];
}
