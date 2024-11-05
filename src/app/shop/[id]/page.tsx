import DetailAccordion from "@/components/shop/DetailAccordion";
import Image from "next/image";
import React from "react";
import TestImage from "@/assets/images/test.webp";
import { CiSquarePlus } from "react-icons/ci";
import { CiSquareMinus } from "react-icons/ci";
import { IoIosHeartEmpty } from "react-icons/io";
import { IoMdShare } from "react-icons/io";

const page = () => {
  return (
    <main className="px-5 pt-14 pb-28 lg:px-8 max-w-[1320px] m-auto flex flex-col items-center justify-center">
      <section className="flex flex-col lg:flex-row lg:gap-8 justify-center lg:justify-between items-center">
        <div className="overflow-hidden relative h-auto lg:w-2/4 w-full">
          <Image src={TestImage} alt="test" className="fill m-auto" />
        </div>
        <div className="my-8 lg:w-2/4 lg:my-0">
          <div className="flex items-start">
            <h2 className="text-xl font-bold break-all pr-10">
              앨범제목
              이마ㅓㄴㅇ;리ㅏㅓㅁ;ㅣㄴ얼;미asdfasdfasdfasdfasdfasdasdfasasdfasdfasdfasdfasdfas
            </h2>
            <button className="mt-[2px]">
              <IoMdShare size={25} />
            </button>
          </div>
          <div className="my-5">
            <p className="text-lg line-through text-dark-gray mb-1">50,000원</p>
            <div className="flex gap-2 items-center">
              <strong className="text-xl text-purple">10%</strong>
              <strong className="text-xl">45,000원</strong>
            </div>
            <ul className="my-5 text-sm">
              <li className="flex py-3 px-3 border-y">
                <h3 className="w-[80px]">배송 정보</h3>
                <p>예약 출고 (2024.08.30 이내 출고)</p>
              </li>
              <li className="flex py-3 px-3 border-b">
                <h3 className="w-[80px]">배송비</h3>
                <p>무료배송</p>
              </li>
              <li className="flex py-3 px-3 border-b">
                <h3 className="w-[80px]">사이즈</h3>
                <p>Free</p>
              </li>
              <li className="flex py-3 px-3 border-b">
                <h3 className="w-[80px]">색상</h3>
                <p className="uppercase">black</p>
              </li>
              <li className="flex py-3 px-3 border-b">
                <h3 className="w-[80px]">수량</h3>
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
          <div>
            <ul className="flex items-center justify-center gap-3">
              <li className="w-1/6 border-2 border-purple cursor-pointer flex items-center justify-center py-3 rounded-md bg-purple">
                <IoIosHeartEmpty size={25} className="text-white" />
              </li>
              <li className="w-2/4 border-2 border-purple py-3 text-center cursor-pointer rounded-md">
                장바구니
              </li>
              <li className="w-2/4 border-2 border-purple bg-purple py-3 text-center cursor-pointer rounded-md text-white">
                구매하기
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className="py-28 w-full">
        <div className="mb-28">
          <ul className="flex justify-between items-center text-center cursor-pointer">
            <li className="w-2/4 border-b-2 border-dark-gray py-4">
              <h3 className="font-bold">상세정보</h3>
            </li>
            <li className="w-2/4 border-b py-4">
              <h3 className="flex gap-2 justify-center items-center">
                리뷰<span>1</span>
              </h3>
            </li>
          </ul>
        </div>
        <div className="text-center">
          <h3 className="font-bold text-2xl mb-10">검은색 로고 티셔츠</h3>
          <div className="flex flex-col gap-1">
            <p>심플하면서도 스타일리시한 디자인의 검은색 티셔츠 입니다.</p>
            <p>고급 면 소재로 제작되어 편안한 착용감을 제공하며,</p>
            <p>앞면에 깔끔한 로고가 프린트 되어 있습니다.</p>
          </div>
          <div className="w-full h-auto m-auto relative my-16">
            <Image src={TestImage} alt="text" className="fill m-auto" />
          </div>
        </div>
      </section>
      <section className="w-full">
        <div>
          <h2 className="text-xl font-bold mb-5">자주 묻는 질문 FAQ</h2>
          <DetailAccordion />
        </div>
      </section>
    </main>
  );
};

export default page;
