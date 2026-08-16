"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X } from "lucide-react";
import DefaultImage from "@/assets/images/default_image.avif";
import { usePlayerState, usePlayerActions } from "@/store/zustand/player-store";

const formatTime = (seconds: number) => {
  const total = Math.floor(seconds);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
};

const AlbumPlayerBar = () => {
  const { albumTitle, albumImage, tracks, currentIndex, isPlaying, volume } = usePlayerState();
  const { togglePlay, playNext, playPrev, setIsPlaying, setVolume, closePlayer } = usePlayerActions();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  //트랙 교체 시에도 현재 볼륨을 유지하기 위한 ref
  const volumeRef = useRef(volume);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentTrack = currentIndex !== null ? tracks[currentIndex] : null;
  const hasPrev = currentIndex !== null && tracks.slice(0, currentIndex).some((track) => track.previewUrl);
  const hasNext = currentIndex !== null && tracks.slice(currentIndex + 1).some((track) => track.previewUrl);

  //트랙 변경 시 오디오 교체
  useEffect(() => {
    if (!currentTrack?.previewUrl) return;
    const audio = new Audio(currentTrack.previewUrl);
    audio.volume = volumeRef.current;
    audioRef.current = audio;
    setCurrentTime(0);
    setDuration(0);

    audio.onloadedmetadata = () => setDuration(audio.duration);
    audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
    audio.onended = () => playNext();
    audio.onpause = () => setIsPlaying(false);
    audio.onplay = () => setIsPlaying(true);
    audio.play().catch(() => setIsPlaying(false));

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack?.previewUrl]);

  //재생/일시정지 동기화
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying && audio.paused) audio.play().catch(() => setIsPlaying(false));
    if (!isPlaying && !audio.paused) audio.pause();
  }, [isPlaying]);

  //볼륨 동기화
  useEffect(() => {
    volumeRef.current = volume;
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  if (!currentTrack) return null;

  const handleSeek = (value: number) => {
    if (audioRef.current) audioRef.current.currentTime = value;
    setCurrentTime(value);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/85 backdrop-blur-md text-white border-t border-white/10">
      <div className="max-w-content m-auto flex items-center gap-4 px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3 min-w-0 flex-1 lg:w-64 lg:flex-none">
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
              onChange={(e) => handleSeek(Number(e.target.value))}
              aria-label="재생 위치"
              className="w-full h-1 accent-white cursor-pointer"
            />
            <span className="w-8 shrink-0">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 lg:w-64 lg:justify-end">
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
          <button onClick={closePlayer} aria-label="플레이어 닫기" className="opacity-60 hover:opacity-100 transition-opacity">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlbumPlayerBar;
