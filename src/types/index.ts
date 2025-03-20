import type { Database } from '@/types/supabase';
import { ButtonHTMLAttributes } from 'react';

//supabase type
export type NewsItem = Database['public']['Tables']['news_gallery']['Row'];
export type GalleryItem = Database['public']['Tables']['gallery']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type ShopListItem = Database['public']['Tables']['goods']['Row'];
export type ShippingAddress = Database['public']['Tables']['shipping_addresses']['Row'];
export type ShippingAddressUpdate = Database['public']['Tables']['shipping_addresses']['Update'];
export type ShippingAddressInsert = Database['public']['Tables']['shipping_addresses']['Insert'];
export type PaymentInsert = Database['public']['Tables']['payments']['Insert'];
export type BoardInsert = Database['public']['Tables']['board']['Insert'];
export type CommentInsert = Database['public']['Tables']['board_comments']['Insert'];
export type OrderReviewInsert = Database['public']['Tables']['goods_reviews']['Insert'];
export type CustomerInfoInsert = Database['public']['Tables']['customer_info']['Insert'];
export type WishListItem = Database['public']['Tables']['wish_lists']['Row'];

//type
export type OAuthProvider = 'google' | 'github' | 'kakao';

export interface GnbArrayList {
  label: string;
  path: string;
  exact: boolean;
}

export interface SignInProps {
  title?: string;
  className?: ButtonHTMLAttributes<HTMLButtonElement>['className'];
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

export type UpdateCommentParams = {
  commentId: number;
  content: string;
};

export type DeleteAddressParams = {
  addressId: string;
  userId: string;
};
