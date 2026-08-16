"use client";
import { useEffect, useState } from "react";
import DefaultImage from "@/assets/images/default_image.avif";
import Image from "next/image";
import { ExternalLink, Play, X } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import type { NewsFeedItemProps } from "@/types/news";

//유튜브 영상은 페이지 이탈 없이 카드 안에서 바로 재생
const getYouTubeEmbedUrl = (url: string) => {
  const videoId = url.match(/[?&]v=([\w-]+)/)?.[1];
  return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1` : null;
};

const NewsFeedItem = ({ item, index }: NewsFeedItemProps) => {
  const [playing, setPlaying] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const isVideo = item.sourceType === "youtube";
  const embedUrl = isVideo ? getYouTubeEmbedUrl(item.url) : null;

  //전체화면 해제(ESC) 시 스크롤이 최상단으로 튀는 문제 방지
  //브라우저가 전체화면 진입 시점에 이미 스크롤을 0으로 만들기 때문에,
  //전체화면이 아닐 때의 위치를 계속 추적해뒀다가 해제 시 마지막 정상 위치로 복원
  useEffect(() => {
    if (!playing) return;
    let lastScrollY = window.scrollY;

    const trackScroll = () => {
      if (!document.fullscreenElement) lastScrollY = window.scrollY;
    };

    //브라우저가 스크롤을 초기화하는 시점이 제각각이라 잠시 동안 반복 복원
    const restoreScroll = () => {
      const target = lastScrollY;
      const startedAt = Date.now();
      const timer = setInterval(() => {
        window.scrollTo(0, target);
        if (Date.now() - startedAt > 400) clearInterval(timer);
      }, 50);
      window.scrollTo(0, target);
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) restoreScroll();
    };

    window.addEventListener("scroll", trackScroll, { passive: true });
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    return () => {
      window.removeEventListener("scroll", trackScroll);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, [playing]);

  if (playing && embedUrl) {
    return (
      <li className="relative overflow-hidden border rounded-lg w-full">
        <div className="aspect-square">
          <iframe
            src={embedUrl}
            title={item.title}
            className="absolute w-full h-full"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
        <button
          onClick={() => setPlaying(false)}
          aria-label="영상 닫기"
          className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </li>
    );
  }

  const card = (
    <div className="aspect-square">
      <Image
        src={item.thumbnail || DefaultImage}
        alt={item.title}
        className="absolute w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        width={500}
        height={500}
        priority={index < 6}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />
      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex items-center justify-center w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
            <Play className="w-5 h-5 fill-white" />
          </span>
        </div>
      )}
      <div className="absolute bottom-0 w-full text-left">
        <div className="flex items-center gap-2 p-3 pb-1.5 text-xs">
          <span
            className={`px-2.5 py-0.5 rounded-2xl backdrop-blur-sm font-bold ${
              isVideo ? "bg-[#FF0000]/85" : "bg-[#3B82F6]/85"
            }`}
          >
            {isVideo ? "영상" : "기사"}
          </span>
          <span className="opacity-75 truncate">{item.sourceName}</span>
          <time className="opacity-75 shrink-0">{formatDate(item.publishedAt, "dash")}</time>
        </div>
        <div className="p-3 pt-0 text-white">
          <h3 className="text-base font-bold truncate group-hover:text-purple transition-colors">{item.title}</h3>
        </div>
      </div>
    </div>
  );

  //기사: 클릭 시 페이지 이탈 없이 카드 안에서 요약 표시, 원문은 오버레이 안의 링크로만 이동
  if (showSummary) {
    return (
      <li className="relative overflow-hidden border rounded-lg w-full bg-gray-900 text-white">
        <div className="aspect-square p-4 flex flex-col gap-2.5 overflow-hidden">
          <div className="flex items-center gap-2 text-xs shrink-0 pr-8">
            <span className="px-2.5 py-0.5 rounded-2xl bg-[#3B82F6]/85 font-bold shrink-0">기사</span>
            <span className="opacity-75 truncate">{item.sourceName}</span>
            <time className="opacity-75 shrink-0">{formatDate(item.publishedAt, "dash")}</time>
          </div>
          <h3 className="font-bold text-sm leading-snug shrink-0">{item.title}</h3>
          <p className="text-xs text-white/75 leading-relaxed overflow-y-auto scrollbar-hide flex-1">
            {item.summary || "이 기사는 미리보기 요약을 제공하지 않아요. 아래에서 원문으로 볼 수 있어요."}
          </p>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-purple-300 hover:text-purple-200 shrink-0"
          >
            원문 보기 <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <button
          onClick={() => setShowSummary(false)}
          aria-label="요약 닫기"
          className="absolute top-2.5 right-2.5 flex items-center justify-center w-7 h-7 rounded-full bg-white/15 hover:bg-white/30 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </li>
    );
  }

  return (
    <li className="relative overflow-hidden border rounded-lg group text-white w-full">
      {embedUrl ? (
        <button onClick={() => setPlaying(true)} aria-label={`${item.title} 재생`} className="block w-full cursor-pointer">
          {card}
        </button>
      ) : (
        <button
          onClick={() => setShowSummary(true)}
          aria-label={`${item.title} 요약 보기`}
          className="block w-full cursor-pointer text-left"
        >
          {card}
        </button>
      )}
    </li>
  );
};

export default NewsFeedItem;
