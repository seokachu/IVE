import { ButtonHTMLAttributes } from "react";
import { Tables } from "@/types/supabase";

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

export interface ShopListItem {
  color: string | null;
  created_at: string | null;
  delivery_info: string | null;
  description: string | null;
  discount_rate: number | null;
  id: string;
  images: string | null;
  price: number;
  rating: number | null;
  review_count: number | null;
  shipping_type: string | null;
  size: string | null;
  thumbnail: string | null;
  title: string;
}

export interface CartItem extends Omit<ShopListItem, "quantity"> {
  quantity: number;
}

export interface ShopListItemProps {
  item: ShopListItem;
}

export interface DiscountedPrice {
  price: number;
  discount_rate?: number | null;
}

export type PriceKeys = "price" | "discount_rate";

export type BadgeFields = Pick<
  ShopListItem,
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
