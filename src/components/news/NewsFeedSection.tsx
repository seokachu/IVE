"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import NewsFeedList from "./NewsFeedList";
import { ArrowDown } from "lucide-react";
import { NEWS_FEED_DEFAULT_LIMIT } from "@/utils/constants";
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
    sectionClass: "pt-32",
  },
  article: {
    id: "article_section",
    title: "News",
    subtitle: "아이브의 새로운 소식을 한눈에 모아보세요",
    moreLabel: "더 많은 기사 보기",
    //마지막 섹션이라 푸터와의 간격 확보
    sectionClass: "pt-32 pb-40",
  },
} as const;

const NewsFeedSection = ({ type }: NewsFeedSectionProps) => {
  const [visibleCount, setVisibleCount] = useState(NEWS_FEED_DEFAULT_LIMIT);
  const { data: feedItems = [], isLoading, isError } = useNewsFeed();
  const meta = SECTION_META[type];

  if (isLoading) return <NewsFeedSkeleton />;
  if (isError) return <Error />;

  const filteredItems = feedItems.filter((item) =>
    type === "video" ? item.sourceType === "youtube" : item.sourceType !== "youtube"
  );
  const visibleItems = filteredItems.slice(0, visibleCount);

  //더 보기 button
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + NEWS_FEED_DEFAULT_LIMIT);
  };

  return (
    <section className={`max-w-content flex justify-center align-center flex-col px-5 m-auto ${meta.sectionClass}`} id={meta.id}>
      <h2 className="text-2xl font-bold lg:text-4xl mb-6 text-center">{meta.title}</h2>
      <h3 className="text-center text-gray-600">{meta.subtitle}</h3>
      <NewsFeedList items={visibleItems} />
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
