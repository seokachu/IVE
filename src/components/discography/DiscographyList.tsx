"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import AlbumTrackList from "@/components/main/AlbumTrackList";
import DefaultImage from "@/assets/images/default_image.avif";
import type { DiscographyItem } from "@/lib/album/sync";

const FILTER_ARRAY = ["전체", "정규", "미니", "싱글"] as const;

const CATEGORY_BADGE_CLASS = {
  정규: "bg-purple text-white",
  미니: "bg-purple-100 text-purple-700",
  싱글: "bg-white/15 text-white",
} as const;

const DiscographyList = ({ items }: { items: DiscographyItem[] }) => {
  const [selectedFilter, setSelectedFilter] = useState<(typeof FILTER_ARRAY)[number]>("전체");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const detailRef = useRef<HTMLDivElement | null>(null);

  const filteredItems = selectedFilter === "전체" ? items : items.filter((item) => item.category === selectedFilter);
  const selected = items.find((item) => item.id === selectedId) || null;

  const handleSelect = (id: string) => {
    const next = selectedId === id ? null : id;
    setSelectedId(next);
    if (next) setTimeout(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
  };

  const handleFilterChange = (filter: (typeof FILTER_ARRAY)[number]) => {
    setSelectedFilter(filter);
    setSelectedId(null);
  };

  return (
    <div>
      <nav aria-label="발매 구분 필터" className="flex justify-center items-center mb-10">
        <ul className="flex items-center gap-2 p-1 bg-white/10 rounded-full">
          {FILTER_ARRAY.map((filter) => (
            <li
              key={filter}
              className={`px-6 py-2 rounded-full whitespace-nowrap text-xs lg:text-sm ${
                selectedFilter === filter ? "bg-white/20" : ""
              }`}
            >
              <Button
                variant="plain"
                size="auto"
                onClick={() => handleFilterChange(filter)}
                className={`font-normal text-white ${selectedFilter === filter ? "font-bold" : "opacity-70"}`}
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
              onClick={() => handleSelect(item.id)}
              aria-expanded={selectedId === item.id}
              className={`w-full text-left group rounded-md ${selectedId === item.id ? "ring-2 ring-purple" : ""}`}
            >
              <div className="relative aspect-square rounded-md overflow-hidden bg-white/10">
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

      {selected && (
        <div ref={detailRef} className="mt-10 max-w-2xl m-auto border border-white/15 rounded-md p-5 bg-white/5">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-16 h-16 shrink-0 rounded overflow-hidden bg-white/10">
              <Image src={selected.image || DefaultImage} alt={selected.title} fill className="object-cover" sizes="4rem" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold truncate">{selected.title}</h3>
              <p className="text-xs opacity-60">
                {selected.category} · {selected.releaseDate.slice(0, 10).replaceAll("-", ".")} · {selected.trackCount}곡
              </p>
              {selected.appleLink && (
                <Link
                  href={selected.appleLink}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-xs opacity-70 hover:opacity-100 mt-1 underline-offset-2 hover:underline"
                >
                  Apple Music에서 듣기 <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>
            <button onClick={() => setSelectedId(null)} aria-label="닫기" className="opacity-60 hover:opacity-100">
              <X className="w-5 h-5" />
            </button>
          </div>
          <AlbumTrackList albumTitle={selected.title} albumImage={selected.image} />
        </div>
      )}
    </div>
  );
};

export default DiscographyList;
