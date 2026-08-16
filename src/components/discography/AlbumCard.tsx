"use client";
import { useState } from "react";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { Play, Pause, Loader2 } from "lucide-react";
import DefaultImage from "@/assets/images/default_image.avif";
import { albumTracksQueryOptions } from "@/hooks/queries/useAlbumTracks";
import { usePlayerActions, usePlayingAlbumTitle, useIsPlaying } from "@/store/zustand/player-store";
import { CATEGORY_BADGE_CLASS, formatReleaseDate } from "@/components/discography/constants";
import type { DiscographyItem } from "@/lib/album/sync";

interface AlbumCardProps {
  item: DiscographyItem;
  isSelected: boolean;
  onOpenDetail: () => void;
}

//디스코그래피 그리드 카드 — 커버 위 구분 배지 + 호버 시 타이틀곡 미리듣기 FAB
const AlbumCard = ({ item, isSelected, onOpenDetail }: AlbumCardProps) => {
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const queryClient = useQueryClient();
  const playingAlbum = usePlayingAlbumTitle();
  const isPlaying = useIsPlaying();
  const { playAlbumTrack, togglePlay, setMinimized } = usePlayerActions();

  const isCurrentAlbum = playingAlbum === item.title;
  //재생 중이거나 로딩 중이면 호버 없이도 오버레이 유지
  const overlayVisibleClass =
    isCurrentAlbum || isLoadingPreview
      ? "opacity-100"
      : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100";

  const handlePreview = async () => {
    if (isCurrentAlbum) {
      togglePlay();
      return;
    }
    setIsLoadingPreview(true);
    try {
      const tracks = await queryClient.fetchQuery(albumTracksQueryOptions(item.title));
      const titleIndex = tracks.findIndex((track) => track.isTitle && track.previewUrl);
      const index = titleIndex >= 0 ? titleIndex : tracks.findIndex((track) => track.previewUrl);
      //미리듣기 가능한 곡이 없으면 상세 시트로 안내
      if (index < 0) {
        onOpenDetail();
        return;
      }
      playAlbumTrack({ albumTitle: item.title, albumImage: item.image, tracks, index });
      setMinimized(false);
    } catch {
      onOpenDetail();
    } finally {
      setIsLoadingPreview(false);
    }
  };

  return (
    <div className={`group relative rounded-md ${isSelected ? "ring-2 ring-purple" : ""}`}>
      <button onClick={onOpenDetail} className="w-full text-left rounded-md" aria-label={`${item.title} 상세 보기`}>
        <div className="relative aspect-square rounded-md overflow-hidden bg-gray-100 dark:bg-white/10">
          <span
            className={`absolute top-2 left-2 z-10 px-1.5 py-0.5 rounded-full text-[10px] ${CATEGORY_BADGE_CLASS[item.category]}`}
          >
            {item.category}
          </span>
          <Image
            src={item.image || DefaultImage}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          <span
            aria-hidden="true"
            className={`absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 ${overlayVisibleClass}`}
          />
          <span
            className={`absolute bottom-3.5 left-3 text-xs font-semibold text-white transition-opacity duration-300 ${overlayVisibleClass}`}
          >
            {isCurrentAlbum ? (isPlaying ? "재생 중" : "일시정지됨") : "타이틀곡 미리듣기"}
          </span>
        </div>
        <div className="mt-2 px-0.5">
          <h3 className="font-bold text-sm truncate">{item.title}</h3>
          <p className="text-xs opacity-60 mt-0.5">
            {formatReleaseDate(item.releaseDate)} · {item.trackCount}곡
          </p>
        </div>
      </button>

      {/* 커버 영역(정사각형) 우하단에 겹치는 미리듣기 버튼 — 중첩 버튼을 피하기 위해 형제로 배치 */}
      <div className="absolute inset-x-0 top-0 aspect-square p-3 flex items-end justify-end pointer-events-none">
        <button
          onClick={handlePreview}
          disabled={isLoadingPreview}
          aria-label={
            isCurrentAlbum ? (isPlaying ? `${item.title} 일시정지` : `${item.title} 재생`) : `${item.title} 타이틀곡 미리듣기`
          }
          className={`pointer-events-auto flex items-center justify-center w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-white text-black shadow-lg transition-all duration-300 hover:scale-105 focus-visible:opacity-100 [@media(pointer:coarse)]:!opacity-100 ${overlayVisibleClass}`}
        >
          {isLoadingPreview ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isCurrentAlbum && isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current translate-x-[1px]" />
          )}
        </button>
      </div>
    </div>
  );
};

export default AlbumCard;
