import type { ShopListItem } from "@/types/index";

export type SortOptionList = "best" | "latest" | "price_low_to_high" | "price_high_to_low";
export type ItemVariant = "shop" | "carousel";
export type ShopMenuProps = Pick<ShopListItem, "id">;

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

export interface ReviewItemProps {
  item: ReviewItem;
}

export interface ReviewResponse {
  reviews: ReviewItem[];
  totalCount: number;
}

export interface UseReviewsProps {
  id: string;
  page: number;
}
