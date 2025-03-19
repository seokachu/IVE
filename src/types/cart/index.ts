import { ShopListItem } from "../shop";

export interface CartItem extends Omit<ShopListItem, "quantity"> {
  quantity: number;
}

export interface CartListItemProps {
  item: CartItem;
}
