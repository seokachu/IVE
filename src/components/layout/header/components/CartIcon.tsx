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
      <div className="relative">
        <ShoppingCart className={`${iconClassName} cursor-pointer`} size={iconSize} />
        {mounted && uniqueItemsCount > 0 && (
          <span
            className={`${className} absolute bottom-3 rounded-full bg-red text-xs text-white w-5 h-5 flex items-center justify-center`}
          >
            {uniqueItemsCount}
          </span>
        )}
      </div>
    </div>
  );
};

export default CartIcon;
