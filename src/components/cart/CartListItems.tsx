import DefaultImage from "@/assets/images/default_image.avif";
import type { CartListItemProps } from "@/types";
import { formatPrice, getDiscountedPrice } from "@/utils/calculateDiscount";
import Image from "next/image";
import { useId } from "react";

const CartListItems = ({ item }: CartListItemProps) => {
  const id = useId();
  const price = getDiscountedPrice(item);

  return (
    <li className="px-2 py-4 relative border-b">
      <label htmlFor={`${item.id}-${id}`} className="flex">
        <input
          type="checkbox"
          id={`${item.id}-${id}`}
          className="w-4 h-4 flex-shrink-0"
        />
        <div className="relative w-[80px] h-[80px] overflow-hidden rounded-md mx-5 flex-shrink-0 border">
          <Image
            src={item.thumbnail || DefaultImage}
            alt={item.title}
            className="object-cover fill"
            width={80}
            height={80}
          />
        </div>
        <div className="flex w-full lg:gap-3 lg:flex-row flex-col lg:items-center lg:justify-between">
          <div className="flex-[4] mr-9 flex flex-col justify-between">
            <h3>{item.title}</h3>
            <p className="text-sm mt-1 text-gray-400">수량 {item.quantity}</p>
          </div>
          <div className="lg:text-right flex-1">
            <span className="mr-1 text-purple font-bold">
              {item.discount_rate}%
            </span>
            <s className="text-dark-gray text-sm mr-1 lg:mr-0 text-nowrap">
              {item.price}원
            </s>
            <strong>{formatPrice(price)}원</strong>
          </div>
        </div>
      </label>
      <button className="absolute right-2 top-[10px]">&times;</button>
    </li>
  );
};

export default CartListItems;
