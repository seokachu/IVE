import Image from 'next/image';
import DefaultImage from '@/assets/images/default_image.avif';
import ProductActions from './ProductActions';
import ShareButton from '@/components/common/button/ShareButton';
import { useShopDetail } from '@/hooks/queries/useShops';
import { formatPrice, getDiscountedPrice } from '@/utils/calculateDiscount';
import Error from '@/components/common/error/Error';
import ProductInfoSkeleton from '@/components/common/loading/ProductInfoSkeleton';
import QuantitySelector from '@/components/common/QuantitySelector';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import type { ShopMenuProps } from '@/types/shop';

const ProductInfo = ({ id }: ShopMenuProps) => {
  const [count, setCount] = useState(1);

  const { data, isLoading, isError } = useShopDetail(id);

  if (isLoading) return <ProductInfoSkeleton />;
  if (isError) return <Error />;

  const price = getDiscountedPrice(data);
  const totalPrice = price * count;

  const handleIncrease = () => {
    if (count >= 5) {
      toast({
        title: '최대 5개 까지 구매 가능합니다.',
      });
      return;
    }
    setCount((prev) => Math.min(prev + 1, 5));
  };

  const handleDecrease = () => {
    if (count > 1) {
      setCount((prev) => Math.max(prev - 1, 1));
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:gap-20 justify-center lg:justify-between items-center">
      <div className="aspect-square overflow-hidden relative h-auto lg:w-2/4 w-full flex items-center justify-center">
        <div className="border w-full">
          <Image
            src={data.thumbnail || DefaultImage}
            alt={data.title}
            className="fill w-full m-auto object-cover"
            width={500}
            height={500}
            priority
          />
        </div>
      </div>
      <div className="w-full my-8 lg:w-2/4 lg:my-0">
        <div className="flex items-start justify-between">
          <h2 className="text-lg lg:text-xl font-bold break-all pr-10">{data.title}</h2>
          <ShareButton className="mt-[2px]" />
        </div>
        <s className="lg:text-lg text-dark-gray mb-1">{formatPrice(data.price)}</s>
        <div className="flex gap-2 items-center">
          <strong className="text-lg lg:text-xl text-purple">{data.discount_rate}%</strong>
          <strong className="text-lg lg:text-xl">{formatPrice(price)}원</strong>
        </div>
        <div className="mb-5">
          <ul className="my-5 text-sm">
            <li className="flex py-3 px-3 border-y">
              <h3 className="w-[100px]">배송 정보</h3>
              <p>{data.delivery_info}</p>
            </li>
            <li className="flex py-3 px-3 border-b">
              <h3 className="w-[100px]">배송비</h3>
              <p>{data.shipping_type}</p>
            </li>
            <li className="flex py-3 px-3 border-b">
              <h3 className="w-[100px]">사이즈</h3>
              <p>{data.size}</p>
            </li>
            <li className="flex py-3 px-3 border-b">
              <h3 className="w-[100px]">색상</h3>
              <p className="uppercase">{data.color}</p>
            </li>
            <li className="flex py-3 px-3 border-b">
              <QuantitySelector
                className="w-[100px]"
                quantity={count}
                increase={handleIncrease}
                decrease={handleDecrease}
              />
            </li>
          </ul>
          <div className="justify-end flex gap-3 items-baseline">
            <p className="text-sm">총 상품금액</p>
            <strong className="text-lg lg:text-xl">{formatPrice(totalPrice)}원</strong>
          </div>
        </div>
        <ProductActions product={data} quantity={count} />
      </div>
    </div>
  );
};

export default ProductInfo;
