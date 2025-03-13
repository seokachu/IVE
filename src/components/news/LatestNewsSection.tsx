"use client";
import { useState } from "react";
import ActionButton from "../common/button/ActionButton";
import NewsCategoryFilter from "./NewsCategoryFilter";
import NewsGallery from "./NewsGallery";
import { FaArrowDown } from "react-icons/fa6";
import { NEWS_CATEGORY_ARRAY } from "@/utils/constants";
import { useNewsGallery } from "@/hooks/queries/useNews";
import Error from "../common/error/Error";
import ContentDetailModal from "./ContentDetailModal";
import LatestNewsSkeleton from "../common/loading/LatestNewsSkeleton";
import type { NewsItem } from "@/types";

const LatestNewsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState(
    NEWS_CATEGORY_ARRAY[0].category
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const { data: newsItems = [], isLoading, isError } = useNewsGallery();

  if (isLoading) return <LatestNewsSkeleton />;
  if (isError) return <Error />;

  //news item click handler
  const handleNewsClick = (newsItem: NewsItem) => {
    setSelectedNews(newsItem);
    setModalOpen(true);
  };

  return (
    <section
      className="max-w-[1280px] flex justify-center align-center flex-col px-5 py-32 m-auto"
      id="news_section"
    >
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
      <NewsGallery
        selectedCategory={selectedCategory}
        newsItems={newsItems}
        onClick={handleNewsClick}
      />
      <div className="text-center">
        <ActionButton
          variant="primary"
          className="inline-flex justify-center items-center gap-1 px-8 py-4 !rounded-full"
        >
          <span>더 많은 소식 보기</span>
          <FaArrowDown className="animate-arrow" />
        </ActionButton>
      </div>
      {modalOpen && (
        <ContentDetailModal
          isOpen={modalOpen}
          onOpenChange={() => setModalOpen(false)}
          contentType="news"
          content={selectedNews}
        />
      )}
    </section>
  );
};

export default LatestNewsSection;
