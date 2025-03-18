"use client";
import { useCallback, useEffect, useRef } from "react";
import ShopListItem from "./ShopListItem";
import { useShops } from "@/hooks/queries/useShops";
import ShopSkeleton from "../common/loading/ShopSkeleton";
import Error from "../common/error/Error";
import type { SortProps } from "@/types";
import { ClipLoader } from "react-spinners";

const ShopList = ({ sort }: SortProps) => {
  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useShops(sort);
  const observerRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
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
      <ul className="flex flex-wrap sm:gap-0 md:gap-5 md:justify-start">
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
      <ul className="flex flex-wrap sm:gap-0 md:gap-5 md:justify-start">
        {items.map((el, index) => (
          <ShopListItem key={el.id} item={el} variant="shop" index={index} />
        ))}
      </ul>
      <div ref={observerRef} className="h-10" />
      {isFetchingNextPage && (
        <div className="flex justify-center items-center py-4">
          <ClipLoader />
        </div>
      )}
      {!hasNextPage && items.length > 0 && (
        <div className="flex justify-center items-center py-4">
          <div className="text-xs lg:text-base font-bold text-gray-500">
            더 이상 표시할 상품이 없습니다.
          </div>
        </div>
      )}
    </>
  );
};

export default ShopList;
