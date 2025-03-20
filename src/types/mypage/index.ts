import type { Tables } from '../supabase';

export interface OrderListItemProps {
  item: Tables<'order_items'>;
}

export interface PaymentDetailsProps {
  item: Tables<'payments'>;
}

export interface UserWishListProps {
  wishlists: Tables<'wish_lists'>[];
}

export interface UserWishListItemProps {
  item: Tables<'wish_lists'>;
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
  };
}

export interface OrderDetailPageProps {
  params: {
    orderId: string;
  };
}

export interface OrderDetailProps {
  orderItems: Tables<'order_items'>[];
  onBack: () => void;
}

export interface DetailOrderItemProps {
  item: Tables<'order_items'>;
  onConfirm: () => void;
}

export interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewData?: Tables<'goods_reviews'> | null;
  orderId: string;
  goodsId: string;
  mode: 'create' | 'edit';
}

export interface ReviewFormData {
  rating: number;
  content: string;
}

export interface WriteReviewFormProps {
  mode: 'create' | 'edit';
  reviewData?: Tables<'goods_reviews'>;
  onClose: () => void;
  orderId: string;
  goodsId: string;
}

export interface MyPageBoards extends Tables<'board'> {
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
  payment: Tables<'payments'>;
}

export interface PostListItemProps {
  item: MyPageBoards;
}

export interface PostListProps {
  posts?: MyPageBoards[];
}

export interface AddressListProps {
  addresses: Tables<'shipping_addresses'>[];
}

export interface AddressListItems {
  item: Tables<'shipping_addresses'>;
}

export interface AddressConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export interface AddressEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  addressData: Tables<'shipping_addresses'>;
}

export type AddressFormProps = {
  mode?: 'create' | 'edit';
  initialData?: Tables<'shipping_addresses'>;
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
  mode: 'create' | 'edit';
  initialData?: Tables<'shipping_addresses'>;
  isFirstAddress: boolean;
}

export interface AddressChange {
  zonecode: string;
  fullAddress: string;
}
