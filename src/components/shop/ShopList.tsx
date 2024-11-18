"use client";
import { useEffect, useState } from "react";
import ShopListItems from "./ShopListItems";
import { getGoodsShop } from "@/lib/supabase/shop";
import { Tables } from "@/types/supabase";

const ShopList = () => {
  const [shopItems, setShopItems] = useState<Tables<"goods">[]>([]);

  useEffect(() => {
    const fetchGoodsShop = async () => {
      try {
        const data = await getGoodsShop();
        setShopItems(data);
        console.log(data);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(
            `데이터를 불러오는 데 실패했습니다. ${error.message}`
          );
        }
      }
    };

    fetchGoodsShop();
  }, []);
  return (
    <ul className="flex items-center justify-between flex-wrap">
      {shopItems.map((el) => (
        <ShopListItems key={el.title} item={el} />
      ))}
    </ul>
  );
};

export default ShopList;
