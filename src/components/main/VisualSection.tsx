"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Volume2, VolumeX } from "lucide-react";

interface VisualSectionProps {
  videoId: string | null;
}

//유튜브 최신 공식 영상을 배경으로 자동 재생하는 비주얼 히어로
const VisualSection = ({ videoId }: VisualSectionProps) => {
  const [muted, setMuted] = useState(true);

  const embedUrl = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=${muted ? 1 : 0}&controls=0&loop=1&playlist=${videoId}&modestbranding=1&rel=0&playsinline=1&disablekb=1`
    : null;

  return (
    <section className="h-[100dvh] lg:h-screen w-full relative overflow-hidden bg-gray-900 flex items-center justify-center">
      {embedUrl ? (
        <iframe
          key={String(muted)}
          src={embedUrl}
          title="IVE 공식 최신 영상"
          aria-hidden="true"
          tabIndex={-1}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[max(100vw,177.78vh)] h-[max(100vh,56.25vw)] pointer-events-none"
          allow="autoplay; encrypted-media"
        />
      ) : (
        <div className="absolute inset-0 bg-main-image bg-cover bg-center" aria-hidden="true" />
      )}
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      {videoId && (
        <div className="absolute top-24 left-5 lg:top-28 lg:left-14 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E72424CC] backdrop-blur-sm text-white text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          OFFICIAL · 최신 영상 자동 재생
        </div>
      )}

      <div className="relative flex flex-col items-center text-center gap-5 px-5">
        <p className="text-xs lg:text-sm font-semibold tracking-[0.3em] text-purple-200">IVE FAN COMMUNITY</p>
        <h1 className="text-white font-bold text-4xl lg:text-[88px] lg:leading-none tracking-[-0.01em] [text-shadow:_1px_3px_12px_rgb(0_0_0_/_0.4)]">
          DIVE INTO IVE
        </h1>
        <p className="text-white/80 text-sm lg:text-lg">아이브의 일정 · 소식 · 음악 · 굿즈를 한곳에서</p>
        <div className="flex items-center gap-3 mt-2">
          <Link
            href="/news"
            className="px-7 py-3.5 rounded-full bg-purple text-white text-sm lg:text-base font-semibold hover:opacity-90 transition-opacity"
          >
            최신 소식 보기
          </Link>
          <Link
            href="/discography"
            className="px-7 py-3.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-sm lg:text-base font-semibold hover:bg-white/25 transition-colors"
          >
            음악 듣기
          </Link>
        </div>
        <ChevronDown className="w-6 h-6 text-white/50 mt-8 animate-bounce" aria-hidden="true" />
      </div>

      {videoId && (
        <button
          onClick={() => setMuted((prev) => !prev)}
          aria-label={muted ? "배경 영상 소리 켜기" : "배경 영상 소리 끄기"}
          className="absolute bottom-10 right-5 lg:right-10 flex items-center justify-center w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors"
        >
          {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      )}

      <div
        className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-[#0A0A0A]"
        aria-hidden="true"
      />
    </section>
  );
};

export default VisualSection;
