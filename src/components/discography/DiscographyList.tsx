"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import StreamingLinkChips from "@/components/common/StreamingLinkChips";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import AlbumTrackList from "@/components/main/AlbumTrackList";
import DefaultImage from "@/assets/images/default_image.avif";
import type { DiscographyItem } from "@/lib/album/sync";

const FILTER_ARRAY = ["전체", "정규", "미니", "싱글"] as const;

const CATEGORY_BADGE_CLASS = {
  정규: "bg-purple text-white",
  미니: "bg-purple-100 text-purple-700",
  싱글: "bg-gray-200 text-gray-700 dark:bg-white/15 dark:text-white",
} as const;

const DiscographyList = ({ items }: { items: DiscographyItem[] }) => {
  const [selectedFilter, setSelectedFilter] = useState<(typeof FILTER_ARRAY)[number]>("전체");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredItems = selectedFilter === "전체" ? items : items.filter((item) => item.category === selectedFilter);
  const selected = items.find((item) => item.id === selectedId) || null;

  const handleFilterChange = (filter: (typeof FILTER_ARRAY)[number]) => {
    setSelectedFilter(filter);
    setSelectedId(null);
  };

  return (
    <div>
      <nav aria-label="발매 구분 필터" className="flex justify-center items-center mb-10">
        <ul className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-white/10 rounded-full">
          {FILTER_ARRAY.map((filter) => (
            <li
              key={filter}
              className={`px-6 py-2 rounded-full whitespace-nowrap text-xs lg:text-sm ${
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
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-7">
        {filteredItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => setSelectedId(item.id)}
              className={`w-full text-left group rounded-md ${selectedId === item.id ? "ring-2 ring-purple" : ""}`}
            >
              <div className="relative aspect-square rounded-md overflow-hidden bg-gray-100 dark:bg-white/10">
                <Image
                  src={item.image || DefaultImage}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
              <div className="mt-2 px-0.5">
                <div className="flex items-center gap-1.5">
                  <span className={`shrink-0 px-1.5 py-0.5 rounded-full text-[10px] ${CATEGORY_BADGE_CLASS[item.category]}`}>
                    {item.category}
                  </span>
                  <h3 className="font-bold text-sm truncate">{item.title}</h3>
                </div>
                <p className="text-xs opacity-60 mt-0.5">
                  {item.releaseDate.slice(0, 10).replaceAll("-", ".")} · {item.trackCount}곡
                </p>
              </div>
            </button>
          </li>
        ))}
      </ul>

      <Sheet open={Boolean(selected)} onOpenChange={(open) => !open && setSelectedId(null)}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md bg-background text-foreground border-gray-200 dark:border-white/10 overflow-y-auto pb-24"
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
                {selected.releaseDate.slice(0, 10).replaceAll("-", ".")} · {selected.trackCount}곡
              </p>
              <div className="mt-4">
                <StreamingLinkChips albumTitle={selected.title} appleLink={selected.appleLink} />
              </div>
              <div className="mt-5 border-t border-gray-200 dark:border-white/10 pt-2">
                <AlbumTrackList albumTitle={selected.title} albumImage={selected.image} />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default DiscographyList;
