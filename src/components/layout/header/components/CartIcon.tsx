"use client";
import { cartState } from "@/store";
import { useEffect, useState } from "react";
import { IoCartOutline } from "react-icons/io5";
import { useRecoilState } from "recoil";

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
}: CartIconProps): JSX.Element => {
  const [mounted, setMounted] = useState(false);
  const [cartItems] = useRecoilState(cartState);

  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={linkClassName}>
      <div className="relative">
        <IoCartOutline
          className={`${iconClassName} cursor-pointer`}
          size={iconSize}
        />
        {mounted && totalQuantity > 0 && (
          <span
            className={`${className} absolute bottom-3 rounded-full bg-rose-500 text-xs text-white w-5 h-5 flex items-center justify-center`}
          >
            {totalQuantity}
          </span>
        )}
      </div>
    </div>
  );
};

export default CartIcon;
