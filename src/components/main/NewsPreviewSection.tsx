"use client";
import Link from "next/link";
import { ArrowRight, Calendar, ChevronRight, MapPin, Sparkles } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import NewsFeedItem from "@/components/news/NewsFeedItem";
import { Skeleton } from "@/components/ui/skeleton";
import { SCHEDULE_CATEGORY_MAP } from "@/utils/constants";
import { getDdayStatus, formatScheduleDate } from "@/utils/schedule";
import { useScheduleFeed } from "@/hooks/queries/useSchedule";
import { useNewsFeed } from "@/hooks/queries/useNews";

const SubHead = ({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) => (
  <div className="w-full flex items-center gap-2.5">
    <span className="text-purple-500 dark:text-purple-300">{icon}</span>
    <h4 className="text-lg font-bold">{title}</h4>
    <p className="text-sm text-gray-400 hidden sm:block">{sub}</p>
  </div>
);

//메인 페이지용 소식 티저 — 다가오는 일정 + 최신 소식 4건
const NewsPreviewSection = () => {
  const { data: schedules = [], isLoading: scheduleLoading } = useScheduleFeed();
  const { data: feedItems = [], isLoading: feedLoading } = useNewsFeed();

  const upcoming = schedules.filter((item) => getDdayStatus(item).state !== "ended").slice(0, 3);
  const latestNews = feedItems.slice(0, 4);

  return (
    <section className="w-full bg-gray-50 dark:bg-black/20" id="news_preview_section">
      <div className="max-w-content m-auto px-5 py-24 lg:py-32 flex flex-col items-center gap-10">
        <SectionTitle title="News" subtitle="아이브의 다가오는 일정과 새로운 소식" />

        {upcoming.length > 0 && (
          <div className="w-full flex flex-col gap-4">
            <SubHead icon={<Calendar className="w-5 h-5" />} title="다가오는 일정" sub="놓치면 안 될 아이브의 스케줄" />
            <ul className="flex flex-col gap-3">
              {upcoming.map((item) => {
                const category = SCHEDULE_CATEGORY_MAP[item.category] ?? SCHEDULE_CATEGORY_MAP.etc;
                const dday = getDdayStatus(item);
                return (
                  <li key={item.id}>
                    <Link
                      href="/news"
                      className="flex items-center gap-4 p-4 lg:p-5 bg-background border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple transition-colors"
                    >
                      <span className="shrink-0 w-16 text-center text-sm font-bold py-2 rounded-md bg-purple-100 text-purple-500">
                        {dday.label}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${category.badgeClass}`}>
                            {category.label}
                          </span>
                          <time className="text-xs text-gray-400">{formatScheduleDate(item)}</time>
                        </div>
                        <h5 className="font-bold truncate">{item.title}</h5>
                      </div>
                      {item.location && (
                        <p className="hidden lg:flex items-center gap-1 text-sm text-gray-500 shrink-0">
                          <MapPin className="w-3.5 h-3.5" />
                          {item.location}
                        </p>
                      )}
                      <span className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 dark:bg-white/15 text-gray-500 dark:text-white">
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="w-full flex flex-col gap-4">
          <SubHead icon={<Sparkles className="w-5 h-5" />} title="최신 소식" sub="뉴스와 영상을 한눈에" />
          {feedLoading || scheduleLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="aspect-square w-full" />
              ))}
            </div>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {latestNews.map((item, index) => (
                <NewsFeedItem key={item.id} item={item} index={index} />
              ))}
            </ul>
          )}
        </div>

        <Link
          href="/news"
          className="inline-flex justify-center items-center gap-1 px-8 py-4 rounded-full text-sm lg:text-base bg-purple text-white hover:opacity-90 transition-opacity"
        >
          <span>소식 전체 보기</span>
          <ArrowRight className="w-4 h-4 animate-arrow-x" />
        </Link>
      </div>
    </section>
  );
};

export default NewsPreviewSection;
