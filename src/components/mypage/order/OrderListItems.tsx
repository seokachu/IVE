import { formatPrice } from "@/utils/calculateDiscount";
import Image from "next/image";
import DefaultImage from "@/assets/images/default_image.avif";
import type { OrderListItemsProps } from "@/types";

const OrderListItems = ({ item }: OrderListItemsProps) => {
  return (
    <li
      key={item.id}
      className="flex gap-4 items-center mb-5 p-4 rounded-lg bg-[#F5F5F5]"
    >
      <Image
        src={item.product_image || DefaultImage}
        alt={item.product_name}
        className="w-20 h-20 object-cover rounded-md border"
        width={500}
        height={500}
      />
      <div className="flex flex-col gap-1">
        <strong>{item.product_name}</strong>
        <p className="text-sm">
          <span>{formatPrice(item.price)}원</span>
          <span className="px-1 inline-block -translate-y-[1px]">|</span>
          <span>수량 {item.quantity}개</span>
        </p>
      </div>
    </li>
  );
};

export default OrderListItems;
