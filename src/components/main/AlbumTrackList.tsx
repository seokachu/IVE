"use client";
import { Play, Pause, Loader2 } from "lucide-react";
import { useAlbumTracks } from "@/hooks/queries/useAlbumTracks";
import { usePlayerState, usePlayerActions } from "@/store/zustand/player-store";
import type { AlbumTrackListProps } from "@/types/main";

const formatDuration = (durationMs: number | null) => {
  if (!durationMs) return "";
  const totalSeconds = Math.round(durationMs / 1000);
  return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, "0")}`;
};

const AlbumTrackList = ({ albumTitle, albumImage, limit, expandPlayerOnPlay = true }: AlbumTrackListProps) => {
  const { data: tracks = [], isLoading, isError } = useAlbumTracks(albumTitle);
  const { albumTitle: playingAlbum, currentIndex, isPlaying } = usePlayerState();
  const { playAlbumTrack, togglePlay, setMinimized } = usePlayerActions();

  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    );
  }
  if (isError || tracks.length === 0) {
    return <p className="text-center text-sm opacity-75 py-6">수록곡 정보를 찾지 못했어요.</p>;
  }

  const handleToggle = (index: number) => {
    //같은 앨범의 같은 트랙이면 재생/일시정지 토글, 아니면 새로 재생
    if (playingAlbum === albumTitle && currentIndex === index) {
      togglePlay();
      return;
    }
    playAlbumTrack({ albumTitle, albumImage, tracks, index });
    setMinimized(!expandPlayerOnPlay);
  };

  //slice(0, limit)는 원본 인덱스를 보존하므로 playAlbumTrack의 index와 어긋나지 않는다
  const visibleTracks = limit ? tracks.slice(0, limit) : tracks;

  return (
    <ul className="max-h-40 lg:max-h-56 overflow-y-auto flex flex-col divide-y divide-gray-200 dark:divide-white/10 text-sm scrollbar-hide">
      {visibleTracks.map((track, index) => {
        const isCurrent = playingAlbum === albumTitle && currentIndex === index;
        const isTrackPlaying = isCurrent && isPlaying;
        return (
          <li key={`${track.trackNumber}-${track.name}`}>
            {track.previewUrl ? (
              <button
                onClick={() => handleToggle(index)}
                aria-label={isTrackPlaying ? `${track.name} 일시정지` : `${track.name} 미리듣기`}
                className="w-full flex items-center gap-3 py-2.5 px-1 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                <span className="w-5 text-center opacity-60 shrink-0">{track.trackNumber}</span>
                <span className={`truncate text-left ${isCurrent ? "font-bold" : ""}`}>{track.name}</span>
                {track.isTitle && (
                  <span className="shrink-0 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-purple text-white">
                    TITLE
                  </span>
                )}
                <span className="opacity-60 shrink-0 text-xs flex-1 text-right">{formatDuration(track.durationMs)}</span>
                <span className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-gray-200 dark:bg-white/15">
                  {isTrackPlaying ? (
                    <Pause className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current" />
                  )}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-3 py-2.5 px-1 opacity-50">
                <span className="w-5 text-center opacity-60 shrink-0">{track.trackNumber}</span>
                <span className="truncate flex-1 text-left">{track.name}</span>
                <span className="opacity-60 shrink-0 text-xs">{formatDuration(track.durationMs)}</span>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default AlbumTrackList;
