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
    setIsPlaying: (isPlaying: boolean) => void;
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

const usePlayerStore = create<PlayerStore>((set, get) => ({
  albumTitle: null,
  albumImage: null,
  tracks: [],
  currentIndex: null,
  isPlaying: false,
  volume: 0.5,
  actions: {
    playAlbumTrack: ({ albumTitle, albumImage, tracks, index }) =>
      set({ albumTitle, albumImage, tracks, currentIndex: index, isPlaying: true }),
    togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
    playNext: () => {
      const { tracks, currentIndex } = get();
      if (currentIndex === null) return;
      const next = findPlayableIndex(tracks, currentIndex, 1);
      if (next !== null) set({ currentIndex: next, isPlaying: true });
    },
    playPrev: () => {
      const { tracks, currentIndex } = get();
      if (currentIndex === null) return;
      const prev = findPlayableIndex(tracks, currentIndex, -1);
      if (prev !== null) set({ currentIndex: prev, isPlaying: true });
    },
    setIsPlaying: (isPlaying) => set({ isPlaying }),
    setVolume: (volume) => set({ volume }),
    closePlayer: () => set({ albumTitle: null, albumImage: null, tracks: [], currentIndex: null, isPlaying: false }),
  },
}));

export const usePlayerState = () =>
  usePlayerStore(
    useShallow((state) => ({
      albumTitle: state.albumTitle,
      albumImage: state.albumImage,
      tracks: state.tracks,
      currentIndex: state.currentIndex,
      isPlaying: state.isPlaying,
      volume: state.volume,
    }))
  );
export const useCurrentTrack = () =>
  usePlayerStore((state) => (state.currentIndex !== null ? state.tracks[state.currentIndex] : null));
export const useIsPlaying = () => usePlayerStore((state) => state.isPlaying);
export const usePlayerActions = () => usePlayerStore((state) => state.actions);
