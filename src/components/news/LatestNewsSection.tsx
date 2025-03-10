"use client";
import { useState } from "react";
import ActionButton from "../common/button/ActionButton";
import NewsCategoryFilter from "./NewsCategoryFilter";
import NewsGallery from "./NewsGallery";
import { FaArrowDown } from "react-icons/fa6";
import { NEWS_CATEGORY_ARRAY } from "@/utils/constants";

const LatestNewsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState(
    NEWS_CATEGORY_ARRAY[0].category
  );

  return (
    <section className="max-w-[1280px] flex justify-center align-center flex-col px-5 py-32 m-auto">
      <h2 className="text-2xl font-bold lg:text-4xl mb-6 text-center">
        Latest News
      </h2>
      <h3 className="text-center text-gray-600 mb-12">
        아이브의 새로운 소식을 가장 먼저 만나보세요
      </h3>
      <NewsCategoryFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <NewsGallery />
      <div className="text-center">
        <ActionButton
          variant="primary"
          className="inline-flex justify-center items-center gap-1 px-8 py-4 !rounded-full"
        >
          <span>더 많은 소식 보기</span>
          <FaArrowDown className="animate-arrow" />
        </ActionButton>
      </div>
    </section>
  );
};

export default LatestNewsSection;
