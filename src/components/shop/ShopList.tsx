"use client";
import { useCallback, useEffect, useRef } from "react";
import ShopListItem from "./ShopListItem";
import { useShops } from "@/hooks/queries/useShops";
import ShopSkeleton from "../common/loading/ShopSkeleton";
import Error from "../common/error/Error";
import Spinner from "@/components/common/Spinner";
import type { SortProps } from "@/types/shop";

//시안 기준: 데스크톱 4열 그리드 (가로 24px · 세로 40px 간격)
const GRID_STYLES = "grid grid-cols-2 gap-x-4 gap-y-7 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10";

const ShopList = ({ sort }: SortProps) => {
  const { data, error, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useShops(sort);
  const observerRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  useEffect(() => {
    const element = observerRef.current;
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });

    if (element) observer.observe(element);
    return () => {
      if (element) observer.disconnect();
    };
  }, [handleObserver]);

  const items = data?.pages.flat() ?? [];

  //loading
  if (isLoading) {
    return (
      <ul className={GRID_STYLES}>
        {Array.from({ length: 8 }).map((_, index) => (
          <ShopSkeleton key={index} variant="shop" />
        ))}
      </ul>
    );
  }

  //error
  if (error) return <Error />;

  return (
    <>
      <ul className={GRID_STYLES} data-testid="shop-list">
        {items.map((el, index) => (
          <ShopListItem key={el.id} item={el} variant="shop" index={index} />
        ))}
        {/* 시안 기준: 다음 페이지 로딩 시 스켈레톤 행 노출 */}
        {isFetchingNextPage &&
          Array.from({ length: 4 }).map((_, index) => <ShopSkeleton key={`next-${index}`} variant="shop" />)}
      </ul>
      <div ref={observerRef} className="h-10" />
      {isFetchingNextPage && (
        <div className="flex justify-center items-center py-4">
          <Spinner size={28} />
        </div>
      )}
      {!hasNextPage && items.length > 0 && (
        <div className="flex justify-center items-center py-4">
          <div className="text-xs lg:text-base font-bold text-gray-500">더 이상 표시할 상품이 없습니다.</div>
        </div>
      )}
    </>
  );
};

export default ShopList;
