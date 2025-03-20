import { Database } from '../supabase';

export type ItemVariant = 'shop' | 'carousel';
export type ShopListItem = Database['public']['Tables']['goods']['Row'];

export interface ShopListItemProps {
  item: ShopListItem;
  variant: ItemVariant;
  index?: number;
}

export interface VariantTypeProps {
  variant: ItemVariant;
}

export interface ProductActionsProps {
  product: ShopListItem;
  quantity: number;
}

export interface DirectPaymentButtonProps {
  product: ShopListItem;
  quantity: number;
}

