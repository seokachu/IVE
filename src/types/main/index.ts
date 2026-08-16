import type { BoardComment } from "../board";
import type { Tables } from "../supabase";

export interface AlbumItemProps {
  album: Tables<"album">;
}

//iTunes 수록곡 미리듣기
export interface AlbumTrack {
  trackNumber: number;
  name: string;
  previewUrl: string | null;
  durationMs: number | null;
}

export interface AlbumTrackListProps {
  albumTitle: string;
  albumImage: string | null;
}

export interface MainBoardListItemProps {
  item: BoardComment;
}
