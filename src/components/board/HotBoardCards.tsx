"use client";
import Link from "next/link";
import Image from "next/image";
import { Eye, Flame, Heart, MessageCircle } from "lucide-react";
import UserAvatar from "@/components/common/UserAvatar";
import MoreLink from "@/components/common/MoreLink";
import { Skeleton } from "@/components/ui/skeleton";
import { useHotBoards } from "@/hooks/queries/useBoard";
import type { BoardSummary } from "@/types/board";

const CardStat = ({ icon, value }: { icon: React.ReactNode; value: number }) => (
  <span className="flex items-center gap-1 text-[11px] font-semibold text-white/80">
    {icon}
    {value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
  </span>
);

//지금 뜨는 글 HOT 3 — 시안 확정: 사진 배경 카드 + 큰 랭크 숫자, 1위는 HOT 배지
const HotBoardCards = () => {
  const { data: boards, isLoading, isError } = useHotBoards();

  if (isLoading) {
    return (
      <section className="flex flex-col gap-5 mb-10 lg:mb-12">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="w-40 h-8" />
          <Skeleton className="w-64 h-4" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-44 lg:h-[220px] rounded-2xl" />
          ))}
        </div>
      </section>
    );
  }
  if (isError || !boards || boards.length === 0) return null;

  const hotBoards = boards.slice(0, 3) as BoardSummary[];

  return (
    <section className="flex flex-col gap-5 mb-10 lg:mb-12">
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h2 className="flex items-center gap-2 text-xl lg:text-2xl font-bold">
            <Flame className="w-5 h-5 lg:w-6 lg:h-6 text-orange-500" aria-hidden="true" />
            지금 뜨는 글
          </h2>
          <p className="text-[13px] text-gray-500">반응이 가장 뜨거웠던 이야기예요</p>
        </div>
        <MoreLink href="/board?filter=popular" label="인기글 전체 보기" />
      </div>
      <ul className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {hotBoards.map((item, index) => (
          <li key={item.id}>
            <Link
              href={`/board/${item.id}`}
              className={`group relative block h-44 lg:h-[220px] rounded-2xl overflow-hidden ${
                item.thumbnail
                  ? "bg-white border border-gray-200"
                  : "bg-gradient-to-br from-purple-300 to-purple-500"
              }`}
            >
              {item.thumbnail && (
                <>
                  <Image
                    src={item.thumbnail}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <span
                    className="absolute inset-x-0 top-0 h-14 lg:h-16 bg-gradient-to-b from-black/35 to-transparent"
                    aria-hidden="true"
                  />
                </>
              )}
              <span
                className="absolute top-1 left-3.5 text-[40px] font-extrabold text-white leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)]"
                aria-label={`${index + 1}위`}
              >
                {index + 1}
              </span>
              {index === 0 && (
                <span className="absolute top-3 right-3.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500 text-white text-[11px] font-bold">
                  <Flame className="w-3 h-3" aria-hidden="true" />
                  HOT
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-black/65 px-3.5 py-3 flex flex-col gap-2">
                <p className="text-[15px] font-bold text-white truncate">{item.title}</p>
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-1.5 min-w-0">
                    <UserAvatar
                      size="xs"
                      userId={item.user_id}
                      userName={item.name}
                      avatarUrl={item.avatar_url}
                      className="!w-[18px] !h-[18px] shrink-0"
                    />
                    <span className="text-xs font-semibold text-white/85 truncate">{item.name}</span>
                  </span>
                  <span className="flex items-center gap-2.5 shrink-0">
                    <CardStat icon={<Heart className="w-3 h-3" aria-hidden="true" />} value={item.like_count ?? 0} />
                    <CardStat icon={<MessageCircle className="w-3 h-3" aria-hidden="true" />} value={item.comment_count ?? 0} />
                    <CardStat icon={<Eye className="w-3 h-3" aria-hidden="true" />} value={item.views ?? 0} />
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default HotBoardCards;
