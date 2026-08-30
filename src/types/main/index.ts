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

//유튜브 IFrame Player API — 히어로 배경 영상 제어에 필요한 부분만 선언 (@types/youtube 미설치)
export interface YouTubePlayer {
  playVideo: () => void;
  getPlayerState: () => number;
  unloadModule: (module: string) => void;
  destroy: () => void;
}

interface YouTubePlayerEvent {
  target: YouTubePlayer;
  data: number;
}

//기존 <iframe>에 붙일 때는 videoId·playerVars 없이 events만 넘긴다
interface YouTubePlayerOptions {
  videoId?: string;
  host?: string;
  playerVars?: Record<string, string | number>;
  events?: {
    onReady?: (event: YouTubePlayerEvent) => void;
    onStateChange?: (event: YouTubePlayerEvent) => void;
    onError?: (event: YouTubePlayerEvent) => void;
  };
}

declare global {
  interface Window {
    YT?: {
      Player: new (el: HTMLElement, options: YouTubePlayerOptions) => YouTubePlayer;
      PlayerState: { PLAYING: number; BUFFERING: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}
