import Image from "next/image";
import DefaultImage from "@/assets/images/default_image.avif";
import { formatPrice, getDiscountedPrice } from "@/utils/calculateDiscount";
import type { Tables } from "@/types/supabase";

interface OrderItemRowProps {
  item: Tables<"order_items">;
}

// 주문완료 화면의 주문상품 로우 (마이페이지 OrderListItem과 별개 — 시안 기준 컴팩트 로우)
const OrderItemRow = ({ item }: OrderItemRowProps) => {
  const price = getDiscountedPrice(item);
  const optionText = [item.size && `사이즈 ${item.size}`, item.color && `색상 ${item.color}`]
    .filter(Boolean)
    .join(" · ");

  return (
    <li className="flex items-center gap-3.5">
      <Image
        src={item.product_image || DefaultImage}
        alt={item.product_name}
        className="h-14 w-14 shrink-0 rounded-[10px] border border-gray-200 object-cover"
        width={56}
        height={56}
      />
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-bold">{item.product_name}</h3>
        <p className="mt-0.5 text-[13px] uppercase text-gray-400">
          {optionText && <span>{optionText}</span>}
          {optionText && <span className="px-1.5 text-gray-300">|</span>}
          <span>수량 {item.quantity}개</span>
        </p>
      </div>
      <strong className="shrink-0 text-[15px] font-bold">{formatPrice(price * item.quantity)}원</strong>
    </li>
  );
};

export default OrderItemRow;
