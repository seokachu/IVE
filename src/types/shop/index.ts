import type { ReactNode } from "react";
import type { ShopListItem } from "@/types/index";

export type SortOptionList =
  | "best"
  | "latest"
  | "price_low_to_high"
  | "price_high_to_low";
export type ItemVariant = "shop" | "carousel";
export type ShopMenuProps = Pick<ShopListItem, "id">;

//목록·캐러셀 공용 상품 타입 — 리뷰 수·평균 별점을 목록 조회 시 함께 계산해 담는다
export interface GoodsItem extends Omit<ShopListItem, "review_count"> {
  review_count: number;
  /** 최근 GOODS_HOT.WINDOW_DAYS일 안에 달린 리뷰 수 — HOT 뱃지 판정용 */
  recent_review_count: number;
  average_rating: number;
}

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
  item: GoodsItem;
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
  className?: string;
  children?: ReactNode;
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

export interface ShopDetailPageParams {
  params: Promise<{
    id: string;
  }>;
}
