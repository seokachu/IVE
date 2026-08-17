"use client";
import { getDiscountedPrice } from "@/utils/calculateDiscount";
import { calculateShipping } from "@/utils/calculateShipping";
import { useEffect, useState } from "react";
import CartSummarySkeleton from "../common/loading/CartSummarySkeleton";
import PaymentButton from "../payment/PaymentButton";
import OrderPriceSummary from "./OrderPriceSummary";
import OrderCustomerInfo from "./OrderCustomerInfo";
import OrderShippingInfo from "./OrderShippingInfo";
import OrderAgreements from "./OrderAgreements";
import { useCartItems, useSelectedItemIds } from "@/store/zustand";
import { useMyMembership } from "@/hooks/queries/useMembership";
import { getMembershipDiscount } from "@/lib/supabase/membership";

const CartSummary = () => {
  const cartItems = useCartItems();
  const selectedItems = useSelectedItemIds();
  const { tier } = useMyMembership();
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

  //멤버십 상시 할인 (DIVE+ 5% / VIP 10%) — 최종 결제 금액에 반영
  const membershipDiscount = getMembershipDiscount(tier, totalDiscountedPrice);

  //배송비는 상품 할인까지 적용한 금액을 기준으로 판단 (멤버십 할인으로 기준선이 흔들리지 않게)
  const shipping = calculateShipping({
    items: selectedCartItems,
    orderAmount: totalDiscountedPrice,
    tier,
  });

  const finalAmount = totalDiscountedPrice - membershipDiscount + shipping.fee;

  return mounted ? (
    <aside className="flex w-full flex-col gap-4 lg:sticky lg:top-24 lg:w-[400px] lg:shrink-0">
      <div className="rounded-[20px] border border-gray-200 bg-card p-7 shadow-[0_12px_32px_rgba(169,79,192,0.10)]">
        <OrderPriceSummary
          totalDiscountedPrice={totalDiscountedPrice}
          totalOriginalPrice={totalOriginalPrice}
          totalDiscountAmount={totalDiscountAmount}
          membershipDiscount={membershipDiscount}
          membershipTier={tier}
          shipping={shipping}
        />
        <OrderAgreements />
        <PaymentButton
          amount={finalAmount}
          shippingFee={shipping.fee}
          orderName={`${selectedCartItems[0]?.title} 외 ${selectedCartItems.length - 1}건`}
        />
        <p className="mt-3.5 text-center text-xs text-gray-400">본인은 만 14세 이상이며 주문 내용을 확인했어요</p>
      </div>
      <OrderCustomerInfo />
      <OrderShippingInfo />
    </aside>
  ) : (
    <CartSummarySkeleton />
  );
};

export default CartSummary;
