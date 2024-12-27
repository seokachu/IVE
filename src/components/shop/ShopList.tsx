"use client";
import { useCallback, useEffect, useMemo, useRef } from "react";
import ShopListItem from "./ShopListItem";
import { useShops } from "@/hooks/queries/useShops";
import ShopSkeleton from "../common/loading/ShopSkeleton";
import Error from "../common/error/Error";
import { sortItems } from "@/utils/sorting";
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

  const sortedItems = useMemo(() => {
    if (!data?.pages) return [];
    const allItems = data.pages.flat();
    return sortItems(allItems, sort);
  }, [data, sort]);

  //loading
  if (isLoading) {
    return (
      <ul className="flex flex-wrap gap-6 sm:justify-center md:justify-start">
        {Array.from({ length: 8 }).map((_, index) => (
          <ShopSkeleton key={index} />
        ))}
      </ul>
    );
  }

  //error
  if (error) return <Error />;

  return (
    <>
      <ul className="flex flex-wrap gap-6 sm:justify-center md:justify-start">
        {sortedItems.map((el) => (
          <ShopListItem key={el.title} item={el} />
        ))}
      </ul>
      <div ref={observerRef} className="h-10" />
      {isFetchingNextPage && (
        <div className="flex justify-center items-center py-4">
          <ClipLoader />
        </div>
      )}
      {!hasNextPage && sortedItems.length > 0 && (
        <div className="flex justify-center items-center py-4">
          <div className="font-bold text-gray-500">
            더 이상 표시할 상품이 없습니다.
          </div>
        </div>
      )}
    </>
  );
};

export default ShopList;
