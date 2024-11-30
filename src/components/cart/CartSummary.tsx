"use client";
import { useRecoilState } from "recoil";
import { cartState, selectedItemState } from "@/store";
import { formatPrice, getDiscountedPrice } from "@/utils/calculateDiscount";
import { useEffect, useState } from "react";
import CartSummarySkeleton from "../common/loading/CartSummarySkeleton";
import PaymentButton from "../payment/PaymentButton";

const CartSummary = () => {
  const [cartItems] = useRecoilState(cartState);
  const [selectedItems] = useRecoilState(selectedItemState);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  //선택된 아이템을 필터링
  const selectedCartItems = cartItems.filter((item) =>
    selectedItems.includes(item.id)
  );

  //총 상품 금액
  const totalOriginalPrice = selectedCartItems.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  //할인된 총 금액
  const totalDiscountedPrice = selectedCartItems.reduce((sum, item) => {
    const discountedPrice = getDiscountedPrice(item);
    return sum + discountedPrice * item.quantity;
  }, 0);

  //총 할인 금액
  const totalDiscountAmount = totalOriginalPrice - totalDiscountedPrice;

  return mounted ? (
    <div className="lg:sticky lg:top-5 flex-1 border rounded-md bg-white shadow-sm p-10 h-fit">
      <h2 className="font-bold text-xl mb-5">결제 금액</h2>
      <div className="border-b pb-3 flex justify-between items-center">
        <p>총 결제 금액</p>
        <p>
          <strong className="text-xl mr-1 text-purple">
            {formatPrice(totalDiscountedPrice)}
          </strong>
          원
        </p>
      </div>
      <div className="pt-5 mb-10">
        <p className="mb-1 flex justify-between items-center">
          상품 금액
          <span>{formatPrice(totalOriginalPrice)}원</span>
        </p>
        <p className="flex justify-between items-center">
          총 할인 금액
          <span className="text-dark-orange">
            -{formatPrice(totalDiscountAmount)}원
          </span>
        </p>
      </div>
      <PaymentButton
        amount={totalDiscountedPrice}
        orderName={`${selectedCartItems[0]?.title} 외 ${
          selectedCartItems.length - 1
        }건`}
      />
    </div>
  ) : (
    <CartSummarySkeleton />
  );
};

export default CartSummary;
