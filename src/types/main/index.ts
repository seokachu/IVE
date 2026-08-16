//iTunes 수록곡 미리듣기
export interface AlbumTrack {
  trackNumber: number;
  name: string;
  previewUrl: string | null;
  durationMs: number | null;
  isTitle: boolean;
}

export interface AlbumTrackListProps {
  albumTitle: string;
  albumImage: string | null;
}
