"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import StreamingLinkChips from "@/components/common/StreamingLinkChips";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import SelectMenu from "@/components/common/select/SelectMenu";
import AlbumTrackList from "@/components/main/AlbumTrackList";
import LatestReleaseHero from "@/components/discography/LatestReleaseHero";
import AlbumCard from "@/components/discography/AlbumCard";
import { CATEGORY_BADGE_CLASS, formatReleaseDate } from "@/components/discography/constants";
import DefaultImage from "@/assets/images/default_image.avif";
import { usePlayerActions } from "@/store/zustand/player-store";
import type { DiscographyItem } from "@/lib/album/sync";

const FILTER_ARRAY = ["전체", "정규", "미니", "싱글"] as const;
type Filter = (typeof FILTER_ARRAY)[number];

const SORT_OPTIONS = [
  { value: "latest", title: "최신순" },
  { value: "oldest", title: "오래된순" },
];
type SortOrder = "latest" | "oldest";

interface YearGroup {
  year: string;
  albums: DiscographyItem[];
}

const DiscographyList = ({ items }: { items: DiscographyItem[] }) => {
  const [selectedFilter, setSelectedFilter] = useState<Filter>("전체");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("latest");
  const { setMinimized } = usePlayerActions();

  //items는 발매일 내림차순 — 히어로는 발매반(정규·미니) 기준. 1곡짜리 리믹스·디지털 싱글이 최신이어도 앨범을 대표로 노출
  const featured = items.find((item) => item.category !== "싱글") || items[0];
  const isLatestRelease = featured === items[0];
  const selected = items.find((item) => item.id === selectedId) || null;

  const counts = useMemo(() => {
    const result: Record<Filter, number> = { 전체: items.length, 정규: 0, 미니: 0, 싱글: 0 };
    for (const item of items) result[item.category] += 1;
    return result;
  }, [items]);

  const yearGroups = useMemo<YearGroup[]>(() => {
    const filtered = selectedFilter === "전체" ? items : items.filter((item) => item.category === selectedFilter);
    const sorted = sortOrder === "latest" ? filtered : [...filtered].reverse();
    const groups: YearGroup[] = [];
    for (const item of sorted) {
      const year = item.releaseDate.slice(0, 4);
      const lastGroup = groups[groups.length - 1];
      if (lastGroup?.year === year) lastGroup.albums.push(item);
      else groups.push({ year, albums: [item] });
    }
    return groups;
  }, [items, selectedFilter, sortOrder]);

  const handleFilterChange = (filter: Filter) => {
    setSelectedFilter(filter);
    setSelectedId(null);
  };

  //시트를 여닫는 동안 플레이어 바와 겹치지 않도록 미니 디스크로 접는다
  const openDetail = (id: string) => {
    setSelectedId(id);
    setMinimized(true);
  };

  if (!featured) return null;

  return (
    <>
      <LatestReleaseHero
        album={featured}
        isLatestRelease={isLatestRelease}
        onOpenDetail={() => openDetail(featured.id)}
      />

      <section className="max-w-content m-auto px-5 pt-12 lg:pt-16 pb-40">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 lg:mb-10">
          <nav aria-label="발매 구분 필터">
            <ul className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-white/10 rounded-full">
              {FILTER_ARRAY.map((filter) => (
                <li
                  key={filter}
                  className={`px-4 lg:px-6 py-2 rounded-full whitespace-nowrap text-xs lg:text-sm ${
                    selectedFilter === filter ? "bg-background dark:bg-white/20" : ""
                  }`}
                >
                  <Button
                    variant="plain"
                    size="auto"
                    onClick={() => handleFilterChange(filter)}
                    className={`font-normal ${selectedFilter === filter ? "font-bold text-purple" : "opacity-70"}`}
                  >
                    {filter}
                    <span className="ml-1 text-[11px] opacity-60">{counts[filter]}</span>
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
          <SelectMenu
            options={SORT_OPTIONS}
            value={sortOrder}
            onChange={(value) => setSortOrder(value as SortOrder)}
            className="w-[110px] h-9 rounded-full text-sm"
          />
        </div>

        <div className="flex flex-col gap-8 lg:gap-10">
          {yearGroups.map((group) => (
            <section key={group.year} aria-label={`${group.year}년 발매`}>
              <div className="flex items-center gap-4 mb-4 lg:mb-5">
                <h3 className="text-lg lg:text-xl font-bold">{group.year}</h3>
                <span aria-hidden="true" className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
                <span className="text-xs text-gray-400 shrink-0">{group.albums.length}장</span>
              </div>
              <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-7">
                {group.albums.map((item) => (
                  <li key={item.id}>
                    <AlbumCard
                      item={item}
                      isSelected={selectedId === item.id}
                      onOpenDetail={() => openDetail(item.id)}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>

      <Sheet
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (open) return;
          setSelectedId(null);
          //시트를 닫으면(배경 클릭·X·Esc) 재생 바를 우측 하단 미니 디스크로 접는다
          setMinimized(true);
        }}
      >
        <SheetContent
          side="right"
          className="w-full sm:max-w-md bg-background text-foreground border-gray-200 dark:border-white/10 overflow-y-auto p-5 pt-12 pb-24"
        >
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="sr-only">{selected.title} 상세</SheetTitle>
                <SheetDescription className="sr-only">앨범 정보와 수록곡 미리듣기</SheetDescription>
              </SheetHeader>
              <div className="relative aspect-square w-full rounded-md overflow-hidden bg-white/10 mb-5">
                <Image
                  src={selected.image || DefaultImage}
                  alt={selected.title}
                  fill
                  className="object-cover"
                  sizes="28rem"
                />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`shrink-0 px-1.5 py-0.5 rounded-full text-[10px] ${CATEGORY_BADGE_CLASS[selected.category]}`}>
                  {selected.category}
                </span>
                <h3 className="font-bold text-lg truncate">{selected.title}</h3>
              </div>
              <p className="text-xs opacity-60 mb-1">
                {formatReleaseDate(selected.releaseDate)} · {selected.trackCount}곡
              </p>
              <div className="mt-4">
                <StreamingLinkChips albumTitle={selected.title} appleLink={selected.appleLink} align="left" />
              </div>
              <div className="mt-5 border-t border-gray-200 dark:border-white/10 pt-2">
                <AlbumTrackList albumTitle={selected.title} albumImage={selected.image} expandPlayerOnPlay={false} />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default DiscographyList;
