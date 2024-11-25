import DefaultImage from "@/assets/images/default_image.avif";
import { CiSquarePlus } from "react-icons/ci";
import { CiSquareMinus } from "react-icons/ci";
import Image from "next/image";
import ProductActions from "./ProductActions";
import ShareButton from "@/components/common/button/ShareButton";
import type { ShopMenuProps } from "@/types";
import { useShop } from "@/hooks/queries/useShops";
import Error from "@/components/common/error/Error";
import { formatPrice, getDiscountedPrice } from "@/utils/calculateDiscount";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import ShopInfoSkeleton from "@/components/common/loading/ShopInfoSkeleton";

const ProductInfo = ({ id }: ShopMenuProps) => {
  const [count, setCount] = useState(1);
  const { data, isLoading, isError } = useShop(id);

  if (isLoading) return <ShopInfoSkeleton />;
  if (isError) return <Error />;

  const price = getDiscountedPrice(data);
  const totalPrice = price * count;

  const handleIncrease = () => {
    if (count >= 5) {
      toast({
        title: "최대 5개 까지 구매 가능합니다.",
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
    <div className="flex flex-col lg:flex-row gap-8 justify-center lg:justify-between items-center">
      <div className="overflow-hidden relative h-auto lg:w-2/4 w-full flex items-center justify-center">
        <Image
          src={data.thumbnail || DefaultImage}
          alt={data.title}
          className="fill m-auto border object-cover"
          width={500}
          height={500}
          priority
        />
      </div>
      <div className="w-full my-8 lg:w-2/4 lg:my-0">
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-bold break-all pr-10">{data.title}</h2>
          <ShareButton className="mt-[2px]" />
        </div>
        <div className="mb-5">
          <s className="text-lg text-dark-gray mb-1">
            {formatPrice(data.price)}
          </s>
          <div className="flex gap-2 items-center">
            <strong className="text-xl text-purple">
              {data.discount_rate}%
            </strong>
            <strong className="text-xl">{formatPrice(price)}원</strong>
          </div>
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
              <p className="uppercase">{data.size}</p>
            </li>
            <li className="flex py-3 px-3 border-b">
              <h3 className="w-[100px]">색상</h3>
              <p className="uppercase">{data.color}</p>
            </li>
            <li className="flex py-3 px-3 border-b">
              <h3 className="w-[100px]">수량</h3>
              <div className="flex gap-3 items-center">
                <button
                  onClick={handleDecrease}
                  disabled={count === 1}
                  className={`${
                    count === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:text-purple"
                  }`}
                >
                  <CiSquareMinus size={25} />
                </button>
                <p>{count}</p>
                <button
                  onClick={handleIncrease}
                  className={`${
                    count >= 5 ? "opacity-50 " : "hover:text-purple"
                  }`}
                >
                  <CiSquarePlus size={25} />
                </button>
              </div>
            </li>
          </ul>
          <div className="justify-end flex gap-3 items-baseline">
            <p className="text-sm">총 상품금액</p>
            <strong className="text-xl">{formatPrice(totalPrice)}원</strong>
          </div>
        </div>
        <ProductActions />
      </div>
    </div>
  );
};

export default ProductInfo;
