"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import ShopListItem from "./ShopListItem";
import { useShops } from "@/hooks/queries/useShops";
import { sortGoods } from "@/lib/supabase/shop";
import ShopSkeleton from "../common/loading/ShopSkeleton";
import Error from "../common/error/Error";
import type { SortProps } from "@/types/shop";

//시안 기준: 데스크톱 4열 그리드 (가로 24px · 세로 40px 간격)
const GRID_STYLES = "grid grid-cols-2 gap-x-4 gap-y-7 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10";
const ITEMS_PER_PAGE = 12;

const ShopList = ({ sort }: SortProps) => {
  const { data, error, isLoading } = useShops();
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [prevSort, setPrevSort] = useState(sort);
  const observerRef = useRef<HTMLDivElement>(null);

  //목록은 한 번만 받아오고 정렬은 클라이언트에서 즉시 수행 — 재요청 없음
  const sortedItems = useMemo(() => sortGoods(data ?? [], sort), [data, sort]);

  //정렬 변경 시 처음부터 다시 노출 (렌더 중 상태 조정 패턴)
  if (prevSort !== sort) {
    setPrevSort(sort);
    setVisibleCount(ITEMS_PER_PAGE);
  }

  const items = sortedItems.slice(0, visibleCount);
  const hasMore = visibleCount < sortedItems.length;

  //로딩 중에는 센티널이 렌더링되지 않으므로 로딩 완료 후 옵저버를 부착한다
  useEffect(() => {
    const element = observerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([target]) => {
        if (target.isIntersecting) {
          setVisibleCount((count) => count + ITEMS_PER_PAGE);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [isLoading]);

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
      </ul>
      <div ref={observerRef} className="h-10" />
      {!hasMore && items.length > 0 && (
        <div className="flex justify-center items-center py-4">
          <div className="text-xs lg:text-base font-bold text-gray-500">더 이상 표시할 상품이 없습니다.</div>
        </div>
      )}
    </>
  );
};

export default ShopList;
