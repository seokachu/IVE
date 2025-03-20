import type { Tables } from '../supabase';
import type { ShopListItem } from '@/types/index';

//약관동의 checkbox
export type AgreementType = 'main' | 'privacy' | 'refund';
export type ModalType = 'privacy' | 'refund' | null;

export interface CartItem extends Omit<ShopListItem, 'quantity'> {
  quantity: number;
}

export interface CartListItemProps {
  item: CartItem;
}

export interface OrderPriceSummaryProps {
  totalDiscountedPrice: number;
  totalOriginalPrice: number;
  totalDiscountAmount: number;
}

export interface OrderCustomerInfoItemProps {
  item: Tables<'customer_info'>;
}

export interface CustomerInfoFormProps {
  initialData?: Tables<'customer_info'>;
  defaultValues?: {
    name?: string;
    email?: string;
  };
  onSuccess: () => void;
}

export interface EmptyStateMessageProps {
  title: string;
  message: string;
}

export interface AgreementCheckboxProps {
  modalType: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
  labelText: string;
}

export interface AgreementModalProps {
  type: 'privacy' | 'refund' | null;
  isOpen: boolean;
  onClose: () => void;
}
