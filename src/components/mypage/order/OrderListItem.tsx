import { formatPrice, getDiscountedPrice } from "@/utils/calculateDiscount";
import Image from "next/image";
import DefaultImage from "@/assets/images/default_image.avif";
import type { OrderListItemProps } from "@/types/mypage";

const OrderListItem = ({ item }: OrderListItemProps) => {
  const price = getDiscountedPrice(item);

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
        <h3 className="flex flex-col lg:flex-row lg:items-center gap-1">
          <span className="font-bold shrink-0">{item.product_name}</span>
          <span className="shrink-0 text-sm text-gray-500">
            {item.delivery_info}
          </span>
        </h3>
        <p className="uppercase text-sm text-gray-500">
          <span>사이즈 : {item.size}</span>&nbsp;&#47;&nbsp;
          <span>색상 : {item.color}</span>
        </p>
        <p className="text-sm">
          <span>{formatPrice(price)}원</span>
          <span className="px-1 inline-block -translate-y-[1px]">|</span>
          <span>수량 {item.quantity}개</span>
        </p>
      </div>
    </li>
  );
};

export default OrderListItem;
