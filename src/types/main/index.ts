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
  /** 앞에서부터 표시할 곡 수 — 생략 시 전체 */
  limit?: number;
  /** 재생 시작 시 플레이어 바를 펼칠지 — 시트 안에서는 false로 미니 디스크 유지 (기본 true) */
  expandPlayerOnPlay?: boolean;
}
