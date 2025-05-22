import type { BoardComment } from "../board";
import type { Tables } from "../supabase";

export interface AlbumItemProps {
  album: Tables<"album">;
}

export interface MainBoardListItemProps {
  item: BoardComment;
}
