"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import SectionTitle from "@/components/common/SectionTitle";
import NewsFeedList from "./NewsFeedList";
import NewsArticleRow from "./NewsArticleRow";
import { ArrowDown } from "lucide-react";
import { useNewsFeed } from "@/hooks/queries/useNews";
import Error from "../common/error/Error";
import NewsFeedSkeleton from "../common/loading/NewsFeedSkeleton";
import type { NewsFeedSectionProps } from "@/types/news";

const SECTION_META = {
  video: {
    id: "video_section",
    title: "Video",
    subtitle: "아이브의 최신 영상을 페이지에서 바로 재생해보세요",
    moreLabel: "더 많은 영상 보기",
    //4열 그리드에 맞춰 8개 단위로 노출
    limit: 8,
    sectionClass: "pt-24 lg:pt-32",
  },
  article: {
    id: "article_section",
    title: "News",
    subtitle: "아이브의 새로운 소식을 한눈에 모아보세요",
    moreLabel: "더 많은 기사 보기",
    limit: 6,
    //마지막 섹션이라 푸터와의 간격 확보
    sectionClass: "pt-24 lg:pt-32 pb-32 lg:pb-40",
  },
} as const;

const NewsFeedSection = ({ type }: NewsFeedSectionProps) => {
  const meta = SECTION_META[type];
  const [visibleCount, setVisibleCount] = useState<number>(meta.limit);
  const { data: feedItems = [], isLoading, isError } = useNewsFeed();

  if (isLoading) return <NewsFeedSkeleton />;
  if (isError) return <Error />;

  const filteredItems = feedItems.filter((item) =>
    type === "video" ? item.sourceType === "youtube" : item.sourceType !== "youtube"
  );
  const visibleItems = filteredItems.slice(0, visibleCount);

  //더 보기 button
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + meta.limit);
  };

  return (
    <section
      className={`max-w-content flex justify-center align-center flex-col px-5 m-auto ${meta.sectionClass}`}
      id={meta.id}
    >
      <SectionTitle title={meta.title} subtitle={meta.subtitle} />
      {visibleItems.length === 0 ? (
        <p className="text-center text-gray-500 py-20">표시할 소식이 없습니다.</p>
      ) : type === "video" ? (
        <NewsFeedList items={visibleItems} />
      ) : (
        <ul className="w-full max-w-3xl m-auto flex flex-col gap-3 mt-10 mb-10">
          {visibleItems.map((item) => (
            <NewsArticleRow key={item.id} item={item} />
          ))}
        </ul>
      )}
      <div className="text-center sticky bottom-10">
        {filteredItems.length > visibleCount && (
          <Button
            onClick={handleLoadMore}
            size="auto"
            className="inline-flex justify-center items-center gap-1 px-8 py-4 !rounded-full text-sm lg:text-base"
          >
            <span>{meta.moreLabel}</span>
            <ArrowDown className="animate-arrow" />
          </Button>
        )}
      </div>
    </section>
  );
};

export default NewsFeedSection;
