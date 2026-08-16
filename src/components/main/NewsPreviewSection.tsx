"use client";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import NewsFeedItem from "@/components/news/NewsFeedItem";
import { Skeleton } from "@/components/ui/skeleton";
import { SCHEDULE_CATEGORY_MAP } from "@/utils/constants";
import { getDdayStatus, formatScheduleDate } from "@/utils/schedule";
import { useScheduleFeed } from "@/hooks/queries/useSchedule";
import { useNewsFeed } from "@/hooks/queries/useNews";

//메인 페이지용 소식 티저 — 다가오는 일정 3건 + 최신 소식 3건, 상세는 /news에서
const NewsPreviewSection = () => {
  const { data: schedules = [], isLoading: scheduleLoading } = useScheduleFeed();
  const { data: feedItems = [], isLoading: feedLoading } = useNewsFeed();

  const upcoming = schedules.filter((item) => getDdayStatus(item).state !== "ended").slice(0, 3);
  const latestNews = feedItems.slice(0, 3);

  return (
    <section className="max-w-content flex justify-center align-center flex-col px-5 py-32 m-auto" id="news_preview_section">
      <h2 className="text-2xl font-bold lg:text-4xl mb-6 text-center">News</h2>
      <h3 className="text-center text-gray-600 mb-12">아이브의 다가오는 일정과 새로운 소식</h3>

      {upcoming.length > 0 && (
        <ul className="flex flex-col gap-3 max-w-3xl w-full m-auto mb-12">
          {upcoming.map((item) => {
            const category = SCHEDULE_CATEGORY_MAP[item.category] ?? SCHEDULE_CATEGORY_MAP.etc;
            const dday = getDdayStatus(item);
            return (
              <li key={item.id}>
                <Link
                  href="/news"
                  className="flex items-center gap-4 p-4 border rounded-md hover:border-purple transition-colors"
                >
                  <span className="shrink-0 w-16 text-center text-sm font-bold py-2 rounded-md bg-purple-100 text-purple-700">
                    {dday.label}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${category.badgeClass}`}>{category.label}</span>
                      <time className="text-xs text-gray-500">{formatScheduleDate(item)}</time>
                    </div>
                    <h4 className="font-bold truncate">{item.title}</h4>
                  </div>
                  {item.location && (
                    <p className="hidden lg:flex items-center gap-1 text-sm text-gray-500 shrink-0">
                      <MapPin className="w-3.5 h-3.5" />
                      {item.location}
                    </p>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {feedLoading || scheduleLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="aspect-square w-full" />
          ))}
        </div>
      ) : (
        latestNews.length > 0 && (
          <ul className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {latestNews.map((item, index) => (
              <NewsFeedItem key={item.id} item={item} index={index} />
            ))}
          </ul>
        )
      )}

      <div className="text-center mt-12">
        <Link
          href="/news"
          className="inline-flex justify-center items-center gap-1 px-8 py-4 rounded-full text-sm lg:text-base bg-purple text-white hover:opacity-90 transition-opacity"
        >
          <span>소식 전체 보기</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};

export default NewsPreviewSection;
