import TestImage from "@/assets/images/test.webp";
import Image from "next/image";
import { useId } from "react";

const CartListItems = () => {
  const id = useId();
  return (
    <li className="px-2 py-4 relative border-b">
      <label htmlFor={`test-${id}`} className="flex">
        <input
          type="checkbox"
          id={`test-${id}`}
          className="w-4 h-4 flex-shrink-0"
        />
        <div className="relative w-[80px] h-[80px] overflow-hidden rounded-md mx-5 flex-shrink-0">
          <Image src={TestImage} alt="test" className="object-cover fill" />
        </div>
        <div className="flex lg:gap-3 lg:flex-row flex-col lg:items-center lg:justify-between">
          <div className="flex-[4] mr-9">
            <h3>
              이것은 아이브 앨범입니다이것은 아이브 앨범입니다이것은 아이브
              앨범입니다
            </h3>
            <p className="text-sm mt-1 text-gray-400">수량 1</p>
          </div>
          <div className="lg:text-right flex-1">
            <span className="mr-1 text-purple font-bold">30%</span>
            <s className="text-dark-gray text-sm mr-1 lg:mr-0 text-nowrap">
              132,000원
            </s>
            <strong>92,400원</strong>
          </div>
        </div>
      </label>
      <button className="absolute right-2 top-1">&times;</button>
    </li>
  );
};

export default CartListItems;
