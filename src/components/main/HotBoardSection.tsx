"use client";
import Link from "next/link";
import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import MoreLink from "@/components/common/MoreLink";
import { Skeleton } from "@/components/ui/skeleton";
import Error from "../common/error/Error";
import { useHotBoards } from "@/hooks/queries/useBoard";

const StatPair = ({ likes, comments, className }: { likes: number; comments: number; className?: string }) => (
  <span className={`flex items-center gap-3 text-xs ${className || ""}`}>
    <span className="flex items-center gap-1">
      <Heart className="w-3 h-3" /> {likes}
    </span>
    <span className="flex items-center gap-1">
      <MessageCircle className="w-3 h-3" /> {comments}
    </span>
  </span>
);

//인기순(좋아요·댓글) 게시글 — 1위 피처드 + 2~6위 랭킹 리스트
const HotBoardSection = () => {
  const { data: boards, isLoading, isError } = useHotBoards();

  if (isLoading) {
    return (
      <section className="max-w-content m-auto px-5 py-24 lg:py-32">
        <div className="flex flex-col items-center gap-3 mb-10">
          <Skeleton className="w-52 h-10" />
          <Skeleton className="w-72 h-5" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Skeleton className="aspect-[16/11] w-full rounded-xl" />
          <div className="flex flex-col gap-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }
  if (isError) return <Error />;
  if (!boards || boards.length === 0) return null;

  const [featured, ...rest] = boards;

  return (
    <section className="max-w-content m-auto px-5 py-24 lg:py-32 flex flex-col gap-8">
      <SectionTitle title="Hot Board" subtitle="지금 가장 인기 있는 팬들의 이야기" />
      <div className="flex justify-end">
        <MoreLink href="/board" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 -mt-4">
        <Link
          href={`/board/${featured.id}`}
          className="group relative rounded-xl overflow-hidden aspect-[16/11] bg-gradient-to-br from-purple-300 to-purple-500"
        >
          {featured.thumbnail && (
            <Image
              src={featured.thumbnail}
              alt=""
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
          <div className="absolute bottom-0 w-full p-5 lg:p-6 text-white flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-purple font-bold">1위</span>
              <span className="opacity-80">인기 게시글</span>
            </div>
            <p className="text-lg lg:text-xl font-bold line-clamp-2">{featured.title}</p>
            <div className="flex items-center gap-3 text-white/70 text-xs">
              <span>{featured.name}</span>
              <StatPair likes={featured.like_count ?? 0} comments={featured.comment_count ?? 0} />
            </div>
          </div>
        </Link>

        <ul className="flex flex-col justify-center divide-y divide-gray-200 dark:divide-gray-700">
          {rest.map((item, index) => (
            <li key={item.id}>
              <Link href={`/board/${item.id}`} className="flex items-center gap-4 py-3.5 group">
                <span className="text-xl font-bold text-purple w-6 text-center shrink-0">{index + 2}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate group-hover:text-purple transition-colors">{item.title}</p>
                  <div className="flex items-center gap-3 text-gray-500 mt-0.5 text-xs">
                    <span>{item.name}</span>
                    <StatPair likes={item.like_count ?? 0} comments={item.comment_count ?? 0} />
                  </div>
                </div>
                {item.thumbnail && (
                  <span className="relative w-[76px] h-[52px] shrink-0 rounded-md overflow-hidden">
                    <Image src={item.thumbnail} alt="" fill className="object-cover" sizes="76px" />
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default HotBoardSection;
