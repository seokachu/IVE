import TestImage from "@/assets/images/default_image.avif";
import { CiSquarePlus } from "react-icons/ci";
import { CiSquareMinus } from "react-icons/ci";
import Image from "next/image";
import ProductActions from "./ProductActions";
import ShareButton from "@/components/common/button/ShareButton";
import { ProductProps } from "@/types";

const ProductInfo = ({ id }: ProductProps) => {
  console.log(id);
  return (
    <section className="flex flex-col lg:flex-row gap-8 justify-center lg:justify-between items-center">
      <div className="overflow-hidden relative h-auto lg:w-2/4 w-full">
        <Image src={TestImage} alt="test" className="fill m-auto" />
      </div>
      <div className="my-8 lg:w-2/4 lg:my-0">
        <div className="flex items-start">
          <h2 className="text-xl font-bold break-all pr-10">
            앨범제목
            이마ㅓㄴㅇ;리ㅏㅓㅁ;ㅣㄴ얼;미asdfasdfasdfasdfasdfasdasdfasasdfasdfasdfasdfasdfas
          </h2>
          <ShareButton className="mt-[2px]" />
        </div>
        <div className="my-5">
          <s className="text-lg text-dark-gray mb-1">50,000원</s>
          <div className="flex gap-2 items-center">
            <strong className="text-xl text-purple">10%</strong>
            <strong className="text-xl">45,000원</strong>
          </div>
          <ul className="my-5 text-sm">
            <li className="flex py-3 px-3 border-y">
              <h3 className="w-[100px]">배송 정보</h3>
              <p>예약 출고 (2024.08.30 이내 출고)</p>
            </li>
            <li className="flex py-3 px-3 border-b">
              <h3 className="w-[100px]">배송비</h3>
              <p>무료배송</p>
            </li>
            <li className="flex py-3 px-3 border-b">
              <h3 className="w-[100px]">사이즈</h3>
              <p>Free</p>
            </li>
            <li className="flex py-3 px-3 border-b">
              <h3 className="w-[100px]">색상</h3>
              <p className="uppercase">black</p>
            </li>
            <li className="flex py-3 px-3 border-b">
              <h3 className="w-[100px]">수량</h3>
              <div className="flex gap-3 items-center">
                <button>
                  <CiSquareMinus size={25} />
                </button>
                <p>1</p>
                <button>
                  <CiSquarePlus size={25} />
                </button>
              </div>
            </li>
          </ul>
          <div className="justify-end flex gap-3 items-center">
            <p className="text-sm">총 상품금액</p>
            <strong className="text-xl">45,000원</strong>
          </div>
        </div>
        <ProductActions />
      </div>
    </section>
  );
};

export default ProductInfo;
