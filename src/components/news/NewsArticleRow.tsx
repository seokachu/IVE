"use client";
import { useState } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import BrandImageFallback from "@/components/common/BrandImageFallback";
import { formatDate } from "@/utils/formatDate";
import type { FeedItem } from "@/types/news";

//기사 가로형 카드 — 요약을 카드 안에 바로 노출하고, 클릭 시 원문을 새 탭으로 연다
const NewsArticleRow = ({ item }: { item: FeedItem }) => {
  const [thumbnailBroken, setThumbnailBroken] = useState(false);

  return (
    <li>
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-4 p-3.5 lg:p-4 bg-background border border-gray-200 rounded-lg hover:border-purple transition-colors"
      >
        <span className="relative w-[72px] h-[72px] lg:w-[88px] lg:h-[88px] shrink-0 rounded-md overflow-hidden bg-gray-100">
          {item.thumbnail && !thumbnailBroken ? (
            //외부 뉴스 썸네일은 매일 새 URL이라 Vercel 이미지 최적화 할당량을 소모 — 이미 리사이즈된 CDN 이미지니 최적화 없이 직접 로드
            <Image
              src={item.thumbnail}
              alt=""
              fill
              className="object-cover"
              sizes="88px"
              unoptimized
              onError={() => setThumbnailBroken(true)}
            />
          ) : (
            <BrandImageFallback />
          )}
        </span>
        <span className="min-w-0 flex-1 flex flex-col gap-1">
          <span className="flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded-full bg-[#3B82F6]/85 text-white font-bold text-[11px]">기사</span>
            <span className="text-gray-400 truncate">{item.sourceName}</span>
            <time className="text-gray-400 shrink-0">{formatDate(item.publishedAt, "dash")}</time>
          </span>
          <strong className="font-bold text-sm lg:text-base truncate group-hover:text-purple transition-colors">
            {item.title}
          </strong>
          {item.summary && <span className="text-[13px] text-gray-500 line-clamp-2 lg:line-clamp-1">{item.summary}</span>}
        </span>
        <span className="hidden md:flex shrink-0 items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-white/15 text-gray-500 dark:text-white">
          <ExternalLink className="w-3.5 h-3.5" />
        </span>
      </a>
    </li>
  );
};

export default NewsArticleRow;
