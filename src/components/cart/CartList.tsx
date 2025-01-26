"use client";
import CartListItem from "./CartListItem";
import { useRecoilState } from "recoil";
import { cartState, selectedItemState } from "@/store";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import useLoading from "@/hooks/useLoading";
import CartListLoading from "../common/loading/CartListLoading";
import { toast } from "@/hooks/use-toast";
import SelectionControl from "../common/select/SelectionControl";
import { useShops } from "@/hooks/queries/useShops";

const CartList = () => {
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = useShops("latest");
  const [mounted, setMounted] = useState(false);
  const [cartItems, setCartItems] = useRecoilState(cartState);
  const [selectedItems, setSelectedItems] = useRecoilState(selectedItemState);
  const { startLoading, stopLoading } = useLoading();

  //loading 처리
  useEffect(() => {
    startLoading();
    setMounted(true);
    stopLoading();
  }, [startLoading, stopLoading]);

  const onIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      });
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersect, { threshold: 0.5 });
    const target = document.querySelector("#sentinel");
    if (target) observer.observe(target);
    return () => observer.disconnect();
  }, [onIntersect]);

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

  //선택삭제 버튼
  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "선택한 내용이 없습니다.",
        variant: "destructive",
      });
      return;
    }
    const newCartItems = cartItems.filter(
      (item) => !selectedItems.includes(item.id)
    );
    localStorage.setItem("shopping_cart", JSON.stringify(newCartItems));
    setCartItems(newCartItems);
    setSelectedItems([]);
    toast({
      title: "선택한 내용이 삭제 되었습니다.",
    });
  };

  //전체삭제 확인 액션
  const handleConfirmDeleteAll = () => {
    localStorage.setItem("shopping_cart", JSON.stringify([]));
    setCartItems([]);
    setSelectedItems([]);
  };

  return (
    <div className="flex-[2] p-5 lg:p-10 border rounded-md bg-white shadow-sm h-fit min-h-[500px]">
      <h2 className="font-bold text-xl">장바구니</h2>
      {mounted && cartItems.length > 0 ? (
        <>
          <SelectionControl
            totalItems={cartItems.length}
            selectedCount={selectedItems.length}
            onSelectAll={handleSelectAll}
            onDeleteSelected={handleDeleteSelected}
            onConfirm={handleConfirmDeleteAll}
            title="장바구니 비우기"
            description="장바구니의 모든 상품이 삭제됩니다. 정말 비우시겠습니까?"
            cancelText="취소"
            confirmText="비우기"
          />
          <ul>
            {cartItems.map((item) => (
              <CartListItem key={item.id} item={item} />
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
