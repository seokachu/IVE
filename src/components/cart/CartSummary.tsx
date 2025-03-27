"use client";
import { useRecoilState } from "recoil";
import { cartState, selectedItemState } from "@/store";
import { getDiscountedPrice } from "@/utils/calculateDiscount";
import { useEffect, useState } from "react";
import CartSummarySkeleton from "../common/loading/CartSummarySkeleton";
import PaymentButton from "../payment/PaymentButton";
import OrderPriceSummary from "./OrderPriceSummary";
import OrderCustomerInfo from "./OrderCustomerInfo";
import OrderShippingInfo from "./OrderShippingInfo";
import OrderAgreements from "./OrderAgreements";

const CartSummary = () => {
  const [cartItems] = useRecoilState(cartState);
  const [selectedItems] = useRecoilState(selectedItemState);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  //선택된 아이템을 필터링
  const selectedCartItems = cartItems.filter((item) => selectedItems.includes(item.id));

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
    <div className="lg:sticky lg:top-5 flex-1 border rounded-md bg-white shadow-sm p-5 lg:p-10 h-fit">
      <OrderPriceSummary
        totalDiscountedPrice={totalDiscountedPrice}
        totalOriginalPrice={totalOriginalPrice}
        totalDiscountAmount={totalDiscountAmount}
      />
      <OrderCustomerInfo />
      <OrderShippingInfo />
      <OrderAgreements />
      <PaymentButton
        amount={totalDiscountedPrice}
        orderName={`${selectedCartItems[0]?.title} 외 ${selectedCartItems.length - 1}건`}
      />
    </div>
  ) : (
    <CartSummarySkeleton />
  );
};

export default CartSummary;
