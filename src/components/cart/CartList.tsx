"use client";
import SelectionControl from "../common/select/SelectionControl";
import CartListItems from "./CartListItems";
import { useRecoilState } from "recoil";
import { cartState } from "@/store";
import { useEffect, useState } from "react";
import Link from "next/link";
import useLoading from "@/hooks/useLoading";
import CartListLoading from "../common/loading/CartListLoading";

const CartList = () => {
  const [cartItems] = useRecoilState(cartState);
  const [mounted, setMounted] = useState(false);
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    startLoading();
    setMounted(true);
    stopLoading();
  }, []);

  if (!mounted) return <CartListLoading />;

  return (
    <div className="flex-[2] p-10 border rounded-md bg-white shadow-sm h-fit min-h-[500px]">
      <h2 className="font-bold text-xl">장바구니</h2>
      {mounted && cartItems.length > 0 ? (
        <>
          <SelectionControl />
          <ul>
            {cartItems.map((item) => (
              <CartListItems key={item.id} item={item} />
            ))}
          </ul>
        </>
      ) : (
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="flex items-center justify-center flex-col gap-2">
            <h3>장바구니가 비어있습니다.</h3>
            <p className="text-gray-500 text-sm mb-5">
              원하는 상품을 담아보세요!
            </p>
            <Link
              href="/shop"
              className="border text-sm py-2 px-5 rounded-md border-purple text-purple hover:text-white hover:bg-purple transition-all ease-out duration-300"
            >
              쇼핑하기
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartList;
