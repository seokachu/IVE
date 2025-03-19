import { Tables } from "../supabase";

export interface OrderListItemProps {
  item: Tables<"order_items">;
}
