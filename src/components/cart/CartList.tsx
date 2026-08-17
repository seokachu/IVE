"use client";
import CartListItem from "./CartListItem";
import { useEffect, useState } from "react";
import Link from "next/link";
import useLoading from "@/hooks/useLoading";
import CartListLoading from "../common/loading/CartListLoading";
import { toast } from "@/hooks/use-toast";
import { ShoppingCart, Truck } from "lucide-react";
import SelectionControl from "../common/select/SelectionControl";
import { useCartActions, useCartItems, useCheckoutActions, useSelectedItemIds } from "@/store/zustand";
import { formatPrice } from "@/utils/calculateDiscount";
import { SHIPPING_POLICY } from "@/utils/constants";

const CartList = () => {
  const [mounted, setMounted] = useState(false);
  const cartItems = useCartItems();
  const selectedItems = useSelectedItemIds();
  const { setCartItems } = useCartActions();
  const { setSelectedItemIds: setSelectedItems } = useCheckoutActions();
  const { startLoading, stopLoading } = useLoading();

  //loading 처리
  useEffect(() => {
    startLoading();
    setMounted(true);
    stopLoading();
  }, [startLoading, stopLoading]);

  //컴포넌트가 마운트 되었을 때 장바구니 모든 아이템 선택하기, 선택삭제 버튼 클릭시 남은 item 선택
  useEffect(() => {
    setSelectedItems(cartItems.map((item) => item.id));
  }, [cartItems, setSelectedItems]);

  if (!mounted) return <CartListLoading />;

  //전체선택
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(cartItems.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  //선택삭제 버튼 — 확인 없이 즉시 삭제 (시안 기준)
  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "선택한 내용이 없습니다.",
        variant: "destructive",
      });
      return;
    }
    const newCartItems = cartItems.filter((item) => !selectedItems.includes(item.id));
    localStorage.setItem("shopping_cart", JSON.stringify(newCartItems));
    setCartItems(newCartItems);
    setSelectedItems([]);
    toast({
      title: "선택한 내용이 삭제 되었습니다.",
    });
  };

  //전체 비우기 확인 액션
  const handleConfirmDeleteAll = () => {
    localStorage.setItem("shopping_cart", JSON.stringify([]));
    setCartItems([]);
    setSelectedItems([]);
  };

  return (
    <div className="min-w-0 flex-1">
      {mounted && cartItems.length > 0 ? (
        <>
          <SelectionControl
            totalItems={cartItems.length}
            selectedCount={selectedItems.length}
            onSelectAll={handleSelectAll}
            onDeleteSelected={handleDeleteSelected}
            onConfirm={handleConfirmDeleteAll}
            title="장바구니를 비울까요?"
            description="담아둔 상품이 모두 삭제돼요. 이 작업은 되돌릴 수 없어요."
            cancelText="취소"
            confirmText="비우기"
          />
          <ul className="mt-3 flex flex-col gap-3.5">
            {cartItems.map((item) => (
              <CartListItem key={item.id} item={item} />
            ))}
          </ul>
          <div className="mt-3.5 flex items-center gap-2.5 rounded-xl bg-purple-50 px-4 py-3">
            <Truck size={18} className="shrink-0 text-purple-400" aria-hidden />
            <p className="text-[13px] text-gray-500">
              {formatPrice(SHIPPING_POLICY.FREE_THRESHOLD)}원 이상 무료배송 · 지금 주문하면 오늘 바로 출발해요
            </p>
          </div>
        </>
      ) : (
        <div className="flex min-h-[480px] items-center justify-center rounded-2xl border border-gray-200 bg-card">
          <div className="flex flex-col items-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-50" aria-hidden>
              <ShoppingCart size={26} className="text-purple-400" />
            </span>
            <h3 className="mt-5 text-lg font-bold">장바구니가 비어 있어요</h3>
            <p className="mt-1.5 text-sm text-gray-500">마음에 드는 굿즈를 담아보세요!</p>
            <Link
              href="/shop"
              className="mt-6 flex h-12 items-center rounded-full bg-purple-300 px-7 text-sm font-bold text-white transition-colors hover:bg-purple-400"
            >
              굿즈샵 구경하러 가기
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartList;
