"use client";
import { useBoardStats } from "@/hooks/queries/useBoard";

const HeroStat = ({ value, label }: { value?: number; label: string }) => (
  <div className="flex flex-col items-center gap-0.5 lg:gap-1">
    <strong className="text-xl lg:text-[26px] font-bold leading-tight tabular-nums">
      {value !== undefined ? value.toLocaleString() : "–"}
    </strong>
    <span className="text-[11px] lg:text-xs text-gray-500">{label}</span>
  </div>
);

//자유게시판 상단 히어로 — 시안 확정: 아이브 무대 사진 + 그라데이션 스크림, 좌측 타이틀 · 우측 커뮤니티 스탯
const BoardHero = () => {
  const { data: stats } = useBoardStats();

  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-board-hero-image bg-cover bg-[position:50%_32%] blur-[2px] scale-105"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-white/25 to-white/90 dark:from-[#1B1B1F]/55 dark:to-[#1B1B1F]/95"
        aria-hidden="true"
      />
      <div className="relative max-w-content m-auto px-5 lg:px-8 pt-12 lg:pt-16 pb-10 lg:pb-14 flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
        <div className="flex flex-col gap-2.5 lg:gap-3 flex-1">
          <span className="self-start px-3 py-1 rounded-full bg-purple-500 text-white text-[10px] lg:text-[11px] font-bold tracking-[0.22em]">
            DIVE COMMUNITY
          </span>
          <h1 className="text-3xl lg:text-[44px] lg:leading-tight font-bold">자유게시판</h1>
          <p className="text-sm lg:text-base text-gray-500">
            다이브들의 이야기가 모이는 라운지 — 오늘의 수다에 함께 DIVE 🌊
          </p>
        </div>
        <div className="flex items-center gap-6 lg:gap-8">
          <HeroStat value={stats?.totalPosts} label="전체 글" />
          <span className="w-px h-10 bg-gray-300/70" aria-hidden="true" />
          <HeroStat value={stats?.todayPosts} label="오늘 새 글" />
          <span className="w-px h-10 bg-gray-300/70" aria-hidden="true" />
          <HeroStat value={stats?.totalComments} label="누적 댓글" />
        </div>
      </div>
    </section>
  );
};

export default BoardHero;
