"use client";
import { useEffect, useState } from "react";
import ShopListItems from "./ShopListItems";
import { Tables } from "@/types/supabase";
import { useShops } from "@/hooks/queries/useShops";
import ShopSkeleton from "../common/loading/ShopSkeleton";
import Error from "../common/error/Error";
import type { SortProps } from "@/types";

const ShopList = ({ sort }: SortProps) => {
  const [shopItems, setShopItems] = useState<Tables<"goods">[]>([]);
  const { data, error, isLoading } = useShops(sort);

  useEffect(() => {
    if (data) return setShopItems(data);
  }, [data]);

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
      {shopItems.map((el) => (
        <ShopListItems key={el.title} item={el} />
      ))}
    </ul>
  );
};

export default ShopList;
