import Image from "next/image";
import { MapPin, CalendarDays, ExternalLink, Play, Newspaper } from "lucide-react";
import { getDdayStatus, formatScheduleDate, findRelatedNews } from "@/utils/schedule";
import { useNewsFeed } from "@/hooks/queries/useNews";
import { formatDate } from "@/utils/formatDate";
import type { ScheduleItem } from "@/types/schedule";

const SOURCE_LABEL = { manual: null, kopis: "KOPIS 공연예술통합전산망 제공", auto: "뉴스에서 자동 수집된 일정" } as const;

const ScheduleCardDetail = ({ item }: { item: ScheduleItem }) => {
  const dday = getDdayStatus(item);
  const year = new Date(item.startsAt).getFullYear();
  const { data: feedItems = [] } = useNewsFeed();
  const relatedNews = findRelatedNews(item, feedItems);
  //대표 사진: 포스터(KOPIS/이미지 검색) → 관련 영상 썸네일 순으로 폴백
  const heroImage = item.poster || relatedNews.find((news) => news.thumbnail)?.thumbnail || null;
  const isPoster = item.source === "kopis" && Boolean(item.poster);

  return (
    <div className="border border-t-0 rounded-b-md px-4 pb-5 lg:px-5 -mt-1 pt-4 bg-gray-50/50">
      <div className="flex flex-col lg:flex-row gap-4">
        {heroImage && (
          <div
            className={`relative shrink-0 rounded-md overflow-hidden bg-gray-100 ${
              isPoster ? "aspect-[3/4] w-40" : "aspect-video w-full lg:w-64"
            }`}
          >
            {/* 외부 수집 이미지(KOPIS 포스터·뉴스 썸네일)는 URL 회전이 잦아 최적화 없이 직접 로드 */}
            <Image
              src={heroImage}
              alt={item.title}
              fill
              className={isPoster ? "object-contain" : "object-cover"}
              sizes="16rem"
              unoptimized
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          {item.description && (
            <p className="text-sm text-gray-600 whitespace-pre-line mb-3">{item.description}</p>
          )}
          <div className="flex flex-col gap-1.5 text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 shrink-0" />
              {year}년 {formatScheduleDate(item)} <span className="text-purple font-bold">{dday.label}</span>
            </p>
            {item.location && (
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0" />
                {item.location}
              </p>
            )}
          </div>
          {!item.description && relatedNews.length === 0 && (
            <p className="text-sm text-gray-400 mt-2">아직 등록된 상세 정보가 없어요.</p>
          )}
          {SOURCE_LABEL[item.source] && <p className="text-xs text-gray-400 mt-3">{SOURCE_LABEL[item.source]}</p>}
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-3 text-sm text-purple hover:underline"
            >
              <span>{item.source === "auto" ? "원본 기사 보기" : "자세히 보기"}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
      {relatedNews.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="text-sm font-bold text-gray-900 mb-3">이 일정 관련 소식</h4>
          <ul className="flex flex-col gap-2">
            {relatedNews.map((news) => (
              <li key={news.id}>
                <a href={news.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
                  {news.thumbnail ? (
                    <span className="relative w-14 h-9 shrink-0 rounded overflow-hidden bg-gray-100">
                      <Image src={news.thumbnail} alt="" fill className="object-cover" sizes="3.5rem" unoptimized />
                    </span>
                  ) : news.sourceType === "youtube" ? (
                    <Play className="w-4 h-4 shrink-0 text-purple" />
                  ) : (
                    <Newspaper className="w-4 h-4 shrink-0 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-700 truncate group-hover:text-purple transition-colors">
                    {news.title}
                  </span>
                  <time className="text-xs text-gray-400 shrink-0 ml-auto">{formatDate(news.publishedAt, "dot")}</time>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ScheduleCardDetail;
