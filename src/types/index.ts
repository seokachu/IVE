import { ButtonHTMLAttributes } from "react";
import { Database, Tables } from "@/types/supabase";

export interface GnbArrayList {
  label: string;
  path: string;
  exact: boolean;
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

export interface VariantTypeProps {
  variant: ItemVariant;
}

export interface ShopListItemProps {
  item: ShopListItem;
  variant: ItemVariant;
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
  user_id: string;
  rating: number;
  content: string;
  created_at: string;
  user: {
    name: string;
    avatar_url: string | null;
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

export interface OrderCustomerInfoItemProps {
  item: Tables<"customer_info">;
}

export type ShippingAddressUpdate =
  Database["public"]["Tables"]["shipping_addresses"]["Update"];

export type ShippingAddress =
  Database["public"]["Tables"]["shipping_addresses"]["Row"];

export type DeleteAddressParams = {
  addressId: string;
  userId: string;
};

export type PaymentInsert = Database["public"]["Tables"]["payments"]["Insert"];

export interface UserWishListProps {
  wishlists: Tables<"wish_lists">[];
}

export interface AgreementModalProps {
  type: "privacy" | "refund" | null;
  isOpen: boolean;
  onClose: () => void;
}

export type AddressFormProps = {
  mode?: "create" | "edit";
  initialData?: Tables<"shipping_addresses">;
  onClose?: () => void;
};

export interface UseAddressFormProps {
  mode: "create" | "edit";
  initialData?: Tables<"shipping_addresses">;
  isFirstAddress: boolean;
}

export interface AddressData {
  user_id: string;
  recipient_name: string;
  recipient_phone: string;
  postal_code: string;
  address_line1: string;
  address_line2: string;
  request: string;
  is_default: boolean;
}

export type UpdateBoardParams = {
  boardId: number;
  title: string;
  content: string;
};

export type UpdateCommentParams = {
  commentId: number;
  content: string;
};

export interface BoardWithRelations extends Tables<"board"> {
  board_comments: [{ count: number }];
  board_likes: [{ count: number }];
  user: {
    name: string;
    avatar_url: string;
  };
}

export interface BoardListItemProps {
  item: BoardWithRelations;
  keyword?: string;
}

export interface BoardListProps {
  boards:
    | {
        data: BoardWithRelations[];
        count: number;
      }
    | undefined;
  keyword?: string;
}

export interface BoardDetailPageParams {
  params: {
    id: string;
  };
}

export interface BoardDetailContainerProps {
  boardId: number;
}

export interface BoardDetailProps {
  item: BoardWithRelations;
}

export interface Comment extends Tables<"board_comments"> {
  user: {
    name: string;
    avatar_url: string;
  };
  likes: { count: number }[];
}

export interface CommentListItemProps {
  boardId: number;
  item: Comment;
  activeEditId: number | null;
  handleEditChange: (id: number | null) => void;
}

export interface BoardsResponse {
  data: BoardWithRelations[];
  count: number;
}

export interface EditPageParams {
  params: {
    id: string;
  };
}
export interface CreateBoardWriteFormProps {
  mode: "create";
}

export interface EditBoardWriteFormProps {
  mode: "edit";
  boardId: number;
}

export type BoardWriteFormProps =
  | CreateBoardWriteFormProps
  | EditBoardWriteFormProps;

export type CommentMode = "create" | "edit";

export type CommentType = "comment" | "reply";

export interface CommentFormProps {
  mode: CommentMode;
  type: CommentType;
  parentId?: number;
  initialContent?: string | null;
  commentId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export interface BoardWithComment extends Tables<"board"> {
  user: {
    id: string;
    name: string;
  };
  board_comments: { count: number }[];
}

export interface MainBoardListItemProps {
  item: BoardWithComment;
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

export interface PostListProps {
  posts?: MyPageBoards[];
}

export interface PostListItemProps {
  item: MyPageBoards;
}
