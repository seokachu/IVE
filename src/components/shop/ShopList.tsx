"use client";
import ShopListItems from "./ShopListItems";

const ShopList = () => {
  return (
    <ul className="flex items-center justify-between flex-wrap">
      <ShopListItems />
    </ul>
  );
};

export default ShopList;
