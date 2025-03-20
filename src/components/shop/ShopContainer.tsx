'use client';
import { useState } from 'react';
import SelectMenu from '@/components/common/select/SelectMenu';
import ShopList from '@/components/shop/ShopList';
import { PRODUCT_SORT_OPTIONS } from '@/utils/constants';
import type { SortOptionList } from '@/types/shop';

const ShopContainer = () => {
  const [sort, setSort] = useState<SortOptionList>('best');

  //Type Guard 함수
  const handleSortChange = (value: string) => {
    const isSortOption = (value: string): value is SortOptionList => {
      return ['best', 'latest', 'price_low_to_high', 'price_high_to_low'].includes(value);
    };

    if (isSortOption(value)) {
      setSort(value);
    }
  };

  return (
    <section className="max-w-[1320px] m-auto px-5 pt-14 pb-28 lg:px-8">
      <div className="flex justify-between mb-8 flex-col lg:flex-row gap-5">
        <h2 className="text-lg lg:text-xl font-bold">굿즈샵</h2>
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
