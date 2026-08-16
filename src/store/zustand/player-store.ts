import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import type { AlbumTrack } from "@/types/main";

interface PlayerStore {
  albumTitle: string | null;
  albumImage: string | null;
  tracks: AlbumTrack[];
  currentIndex: number | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  actions: {
    playAlbumTrack: (payload: {
      albumTitle: string;
      albumImage: string | null;
      tracks: AlbumTrack[];
      index: number;
    }) => void;
    togglePlay: () => void;
    playNext: () => void;
    playPrev: () => void;
    seek: (seconds: number) => void;
    setVolume: (volume: number) => void;
    closePlayer: () => void;
  };
}

//미리듣기 가능한 다음/이전 트랙 인덱스 찾기
const findPlayableIndex = (tracks: AlbumTrack[], from: number, direction: 1 | -1) => {
  for (let i = from + direction; i >= 0 && i < tracks.length; i += direction) {
    if (tracks[i].previewUrl) return i;
  }
  return null;
};

//오디오는 페이지·컴포넌트와 무관한 전역 싱글턴 — 플레이어 바가 여러 페이지에 마운트돼도 재생 충돌이 없다
let audio: HTMLAudioElement | null = null;

const usePlayerStore = create<PlayerStore>((set, get) => {
  const getAudio = () => {
    if (!audio && typeof window !== "undefined") {
      audio = new Audio();
      audio.onended = () => get().actions.playNext();
      audio.ontimeupdate = () => set({ currentTime: audio?.currentTime || 0 });
      audio.onloadedmetadata = () => set({ duration: audio?.duration || 0 });
    }
    return audio;
  };

  const loadAndPlay = (previewUrl: string) => {
    const player = getAudio();
    if (!player) return;
    player.src = previewUrl;
    player.volume = get().volume;
    set({ currentTime: 0, duration: 0, isPlaying: true });
    player.play().catch(() => set({ isPlaying: false }));
  };

  return {
    albumTitle: null,
    albumImage: null,
    tracks: [],
    currentIndex: null,
    isPlaying: false,
    volume: 0.5,
    currentTime: 0,
    duration: 0,
    actions: {
      playAlbumTrack: ({ albumTitle, albumImage, tracks, index }) => {
        const previewUrl = tracks[index]?.previewUrl;
        if (!previewUrl) return;
        set({ albumTitle, albumImage, tracks, currentIndex: index });
        loadAndPlay(previewUrl);
      },
      togglePlay: () => {
        const player = getAudio();
        if (!player || !player.src) return;
        if (get().isPlaying) {
          player.pause();
          set({ isPlaying: false });
        } else {
          set({ isPlaying: true });
          player.play().catch(() => set({ isPlaying: false }));
        }
      },
      playNext: () => {
        const { tracks, currentIndex } = get();
        if (currentIndex === null) return;
        const next = findPlayableIndex(tracks, currentIndex, 1);
        if (next === null) {
          set({ isPlaying: false });
          return;
        }
        set({ currentIndex: next });
        loadAndPlay(tracks[next].previewUrl!);
      },
      playPrev: () => {
        const { tracks, currentIndex } = get();
        if (currentIndex === null) return;
        const prev = findPlayableIndex(tracks, currentIndex, -1);
        if (prev === null) return;
        set({ currentIndex: prev });
        loadAndPlay(tracks[prev].previewUrl!);
      },
      seek: (seconds) => {
        const player = getAudio();
        if (player) player.currentTime = seconds;
        set({ currentTime: seconds });
      },
      setVolume: (volume) => {
        const player = getAudio();
        if (player) player.volume = volume;
        set({ volume });
      },
      closePlayer: () => {
        const player = getAudio();
        if (player) {
          player.pause();
          player.removeAttribute("src");
        }
        set({
          albumTitle: null,
          albumImage: null,
          tracks: [],
          currentIndex: null,
          isPlaying: false,
          currentTime: 0,
          duration: 0,
        });
      },
    },
  };
});

export const usePlayerState = () =>
  usePlayerStore(
    useShallow((state) => ({
      albumTitle: state.albumTitle,
      albumImage: state.albumImage,
      tracks: state.tracks,
      currentIndex: state.currentIndex,
      isPlaying: state.isPlaying,
      volume: state.volume,
      currentTime: state.currentTime,
      duration: state.duration,
    }))
  );
export const useCurrentTrack = () =>
  usePlayerStore((state) => (state.currentIndex !== null ? state.tracks[state.currentIndex] : null));
export const useIsPlaying = () => usePlayerStore((state) => state.isPlaying);
export const usePlayerActions = () => usePlayerStore((state) => state.actions);
