"use client";
import { useCartItems } from "@/store/zustand";
import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
interface CartIconProps {
  iconSize?: number;
  iconClassName?: string;
  linkClassName?: string;
  className?: string;
}

const CartIcon = ({
  iconSize = 24,
  iconClassName = "",
  linkClassName = "",
  className = "",
}: CartIconProps) => {
  const [mounted, setMounted] = useState(false);
  const cartItems = useCartItems();

  const uniqueItemsCount = cartItems.length;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={linkClassName}>
      {/* w-fit: 뱃지가 아이콘 모서리에 정확히 겹치도록 래퍼를 아이콘 크기로 고정 */}
      <div className="relative w-fit">
        <ShoppingCart className={`${iconClassName} cursor-pointer`} size={iconSize} />
        {mounted && uniqueItemsCount > 0 && (
          <span
            className={`${className} absolute -right-2 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold leading-none text-white`}
          >
            {uniqueItemsCount}
          </span>
        )}
      </div>
    </div>
  );
};

export default CartIcon;
