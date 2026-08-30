"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronUp, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X } from "lucide-react";
import DefaultImage from "@/assets/images/default_image.avif";
import { usePlayerState, usePlayerActions } from "@/store/zustand/player-store";

const formatTime = (seconds: number) => {
  const total = Math.floor(seconds);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
};

const AlbumPlayerBar = () => {
  const { albumTitle, albumImage, tracks, currentIndex, isPlaying, volume, currentTime, duration, isMinimized } =
    usePlayerState();
  const { togglePlay, playNext, playPrev, seek, setVolume, setMinimized, closePlayer } = usePlayerActions();

  //페이지를 이동하면 콘텐츠를 가리지 않도록 미니 디스크로 자동 접힘 (클릭으로 다시 펼침)
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  useEffect(() => {
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;
    setMinimized(true);
  }, [pathname, setMinimized]);

  //터치 기기는 호버가 없으므로 디스크 탭 시 보조 컨트롤을 잠시 노출
  const [showMiniControls, setShowMiniControls] = useState(false);
  const miniControlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    return () => {
      if (miniControlsTimer.current) clearTimeout(miniControlsTimer.current);
    };
  }, []);
  const revealMiniControls = () => {
    setShowMiniControls(true);
    if (miniControlsTimer.current) clearTimeout(miniControlsTimer.current);
    miniControlsTimer.current = setTimeout(() => setShowMiniControls(false), 4000);
  };

  const currentTrack = currentIndex !== null ? tracks[currentIndex] : null;
  const hasPrev = currentIndex !== null && tracks.slice(0, currentIndex).some((track) => track.previewUrl);
  const hasNext = currentIndex !== null && tracks.slice(currentIndex + 1).some((track) => track.previewUrl);

  if (!currentTrack) return null;

  //미니 디스크 — 회전하는 커버, 호버 시 펼치기 안내 (GoTop 버튼 위에 배치)
  if (isMinimized) {
    return (
      <div className="fixed bottom-20 mb-tabbar right-6 z-[60] flex items-center gap-2 group">
        {/* 호버·포커스·탭 직후에 왼쪽으로 슬라이드되는 보조 컨트롤 — 펼치기·종료 */}
        <div
          className={`flex items-center gap-1.5 transition-all duration-200 ${
            showMiniControls
              ? "opacity-100 translate-x-0 pointer-events-auto"
              : "opacity-0 translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:translate-x-0 group-focus-within:pointer-events-auto"
          }`}
        >
          <button
            onClick={() => setMinimized(false)}
            aria-label="플레이어 펼치기"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white hover:bg-black/90 transition-colors"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={closePlayer}
            aria-label="플레이어 종료"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white hover:bg-black/90 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 디스크 클릭 = 즉시 일시정지/재생 — 실수로 재생돼도 한 번에 멈춘다 */}
        <button
          onClick={() => {
            togglePlay();
            revealMiniControls();
          }}
          aria-label={isPlaying ? `${currentTrack.name} 일시정지` : `${currentTrack.name} 재생`}
          className="relative w-12 h-12 rounded-full overflow-hidden border border-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
        >
          <div className={`relative w-full h-full ${isPlaying ? "animate-spin [animation-duration:6s]" : ""}`}>
            <Image src={albumImage || DefaultImage} alt={albumTitle || ""} fill className="object-cover" sizes="3rem" />
          </div>
          <span aria-hidden="true" className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-black/70 border border-white/60" />
          <span
            aria-hidden="true"
            className={`absolute inset-0 flex items-center justify-center bg-black/45 text-white transition-opacity ${
              isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white translate-x-[1px]" />}
          </span>
        </button>
      </div>
    );
  }

  return (
    //디자인 시스템 PlayerBar — 하단 고정 풀폭 바 대신 플로팅 카드 형태
    <div className="fixed bottom-3 mb-tabbar lg:bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-1.5rem)] max-w-3xl rounded-xl bg-black/85 backdrop-blur-md text-white border border-white/10 shadow-2xl">
      <div className="flex items-center gap-4 px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3 min-w-0 flex-1 lg:w-52 lg:flex-none">
          <div className="relative w-11 h-11 shrink-0 rounded overflow-hidden bg-white/10">
            <Image src={albumImage || DefaultImage} alt={albumTitle || ""} fill className="object-cover" sizes="2.75rem" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold truncate">{currentTrack.name}</p>
            <p className="text-xs opacity-60 truncate">아이브 · {albumTitle}</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
          <div className="flex items-center gap-4">
            <button onClick={playPrev} disabled={!hasPrev} aria-label="이전 곡" className="disabled:opacity-30">
              <SkipBack className="w-4 h-4 fill-white" />
            </button>
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? "일시정지" : "재생"}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white text-black hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black translate-x-[1px]" />}
            </button>
            <button onClick={playNext} disabled={!hasNext} aria-label="다음 곡" className="disabled:opacity-30">
              <SkipForward className="w-4 h-4 fill-white" />
            </button>
          </div>
          <div className="hidden sm:flex items-center gap-2 w-full max-w-md text-[11px] opacity-80">
            <span className="w-8 text-right shrink-0">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 30}
              step={0.1}
              value={currentTime}
              onChange={(e) => seek(Number(e.target.value))}
              aria-label="재생 위치"
              className="w-full h-1 accent-white cursor-pointer"
            />
            <span className="w-8 shrink-0">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 lg:w-52 lg:justify-end">
          <div className="hidden lg:flex items-center gap-2">
            <button onClick={() => setVolume(volume === 0 ? 0.5 : 0)} aria-label={volume === 0 ? "음소거 해제" : "음소거"}>
              {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              aria-label="볼륨"
              className="w-24 h-1 accent-white cursor-pointer"
            />
          </div>
          <button
            onClick={() => setMinimized(true)}
            aria-label="플레이어 접기"
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
          <button onClick={closePlayer} aria-label="플레이어 닫기" className="opacity-60 hover:opacity-100 transition-opacity">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlbumPlayerBar;
