"use client";
import { useMemo } from "react";
import ShopListItem from "./ShopListItem";
import { useShops } from "@/hooks/queries/useShops";
import ShopSkeleton from "../common/loading/ShopSkeleton";
import Error from "../common/error/Error";
import { sortItems } from "@/utils/sorting";
import type { SortProps } from "@/types";

const ShopList = ({ sort }: SortProps) => {
  const { data, error, isLoading } = useShops(sort);

  const sortedItems = useMemo(() => {
    return sortItems(data || [], sort);
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
    <ul className="flex flex-wrap gap-6 sm:justify-center md:justify-start">
      {sortedItems.map((el) => (
        <ShopListItem key={el.title} item={el} />
      ))}
    </ul>
  );
};

export default ShopList;
