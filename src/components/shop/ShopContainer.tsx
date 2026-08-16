"use client";
import { useState } from "react";
import SelectMenu from "@/components/common/select/SelectMenu";
import ShopList from "@/components/shop/ShopList";
import { useShopsCount } from "@/hooks/queries/useShops";
import { PRODUCT_SORT_OPTIONS } from "@/utils/constants";
import type { SortOptionList } from "@/types/shop";

const ShopContainer = () => {
  const [sort, setSort] = useState<SortOptionList>("best");
  const { data: totalCount } = useShopsCount();

  //Type Guard 함수
  const handleSortChange = (value: string) => {
    const isSortOption = (value: string): value is SortOptionList => {
      return ["best", "latest", "price_low_to_high", "price_high_to_low"].includes(value);
    };

    if (isSortOption(value)) {
      setSort(value);
    }
  };

  return (
    <section className="max-w-container m-auto px-5 pt-14 pb-28 lg:px-8">
      {/* 시안 기준: 아이브로우 + 영문 타이틀 + 서브 카피 페이지 헤드 */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold tracking-[2px] text-orange-500">OFFICIAL MD</span>
        <h2 className="text-2xl font-bold lg:text-[2rem]">Goods Shop</h2>
        <p className="text-sm text-gray-500">아이브의 공식 굿즈를 한자리에서 만나보세요</p>
      </div>
      <div className="mt-7 mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <span className="text-sm text-gray-500">{typeof totalCount === "number" && `전체 ${totalCount}개`}</span>
        <SelectMenu
          options={PRODUCT_SORT_OPTIONS}
          value={sort}
          onChange={handleSortChange}
          className="lg:w-[180px] w-full"
        />
      </div>
      <ShopList sort={sort} />
    </section>
  );
};

export default ShopContainer;
