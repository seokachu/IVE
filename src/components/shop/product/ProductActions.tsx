"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AddToCartDrawer from "./AddToCartDrawer";
import { cartStorage } from "@/utils/cartStorage";
import { toast } from "@/hooks/use-toast";
import useWishListWithLocal from "@/hooks/queries/useWishListWithLocal";
import { Heart } from "lucide-react";
import DirectPaymentButton from "@/components/payment/DirectPaymentButton";
import RollingNumber from "@/components/common/RollingNumber";
import { useCartActions } from "@/store/zustand";
import { getDiscountedPrice } from "@/utils/calculateDiscount";
import { useMyMembership } from "@/hooks/queries/useMembership";
import { MEMBERSHIP_DISCOUNT_RATES, getMembershipDiscount } from "@/lib/supabase/membership";
import type { ProductActionsProps } from "@/types/shop";
import type { CartItem } from "@/types/cart";

const ProductActions = ({ product, quantity }: ProductActionsProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { setCartItems } = useCartActions();
  const { isWished, toggleWishList } = useWishListWithLocal(product.id);
  const { tier } = useMyMembership();

  const totalPrice = getDiscountedPrice(product) * quantity;
  //멤버십 상시 할인 반영 최종 결제액 — DirectPaymentButton의 실제 청구 금액과 일치시킨다
  const membershipDiscount = getMembershipDiscount(tier, totalPrice);
  const finalPrice = totalPrice - membershipDiscount;

  const onClickCart = () => {
    try {
      //현재 장바구니에 담긴 수량 확인
      const currentQuantity = cartStorage.getItemQuantity(product.id);

      //추가할 수량과 합쳐서 5개를 초과하는지 체크
      if (currentQuantity + quantity > 5) {
        toast({
          title: `현재 장바구니에 ${currentQuantity}개가 있어 ${quantity}개를 추가할 수 없습니다.`,
          description: "최대 구매 가능 수량은 5개입니다.",
          variant: "warning",
        });
        return;
      }

      const cartItem: CartItem = {
        ...product,
        quantity,
      };

      const updatedCart = cartStorage.addItem(cartItem);
      setCartItems(updatedCart);
      setIsDrawerOpen(true);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: error.message,
        });
      }
    }
  };

  const onClickCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  //찜하기 버튼
  const onClickHeart = () => {
    toggleWishList();
  };

  return (
    <>
      {/* 시안 기준: 그라데이션 구매 CTA + 찜 서클 · 장바구니 필 보조 버튼 */}
      <div className="flex flex-col gap-2.5">
        {membershipDiscount > 0 && (
          <p className="text-center text-[11px] font-semibold text-purple-500 dark:text-purple-300">
            {tier === "vip" ? "VIP" : "DIVE+"} 멤버십 {Math.round(MEMBERSHIP_DISCOUNT_RATES[tier] * 100)}% 할인 적용가
          </p>
        )}
        <DirectPaymentButton
          product={product}
          quantity={quantity}
          className="h-14 w-full rounded-full bg-gradient-to-r from-purple-400 to-orange-300 text-base font-bold text-white hover:opacity-90"
        >
          <RollingNumber value={finalPrice} />원 바로 구매하기
        </DirectPaymentButton>
        <div className="flex items-center gap-2.5">
          <Button
            onClick={onClickHeart}
            variant="plain"
            size="auto"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gray-300"
            aria-label="찜하기"
          >
            <Heart
              size={20}
              fill={isWished ? "currentColor" : "none"}
              className={isWished ? "text-red" : "text-purple-400"}
            />
          </Button>
          <Button
            onClick={onClickCart}
            variant="outlineBrand"
            size="auto"
            className="h-12 w-full rounded-full bg-transparent text-[15px]"
          >
            장바구니 담기
          </Button>
        </div>
      </div>
      {isDrawerOpen && (
        <AddToCartDrawer isOpen={isDrawerOpen} onClose={onClickCloseDrawer} product={product} quantity={quantity} />
      )}
    </>
  );
};

export default ProductActions;
