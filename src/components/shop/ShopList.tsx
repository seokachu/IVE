"use client";
import { useEffect, useState } from "react";
import ShopListItems from "./ShopListItems";
import { Tables } from "@/types/supabase";
import { useShops } from "@/hooks/queries/useShops";
import ShopSkeleton from "../common/loading/ShopSkeleton";
import Error from "../common/error/Error";

const ShopList = () => {
  const [shopItems, setShopItems] = useState<Tables<"goods">[]>([]);
  const { data, error, isLoading } = useShops();

  useEffect(() => {
    if (data) return setShopItems(data);
  }, [data]);

  //loading
  if (isLoading) {
    return (
      <ul className="flex items-center justify-between flex-wrap">
        {Array.from({ length: 8 }).map((_, index) => (
          <ShopSkeleton key={index} />
        ))}
      </ul>
    );
  }

  //error
  if (error) return <Error />;

  return (
    <ul className="flex items-center justify-between flex-wrap">
      {shopItems.map((el) => (
        <ShopListItems key={el.title} item={el} />
      ))}
    </ul>
  );
};

export default ShopList;
