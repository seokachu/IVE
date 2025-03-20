import type { Tables } from '../supabase';

export interface BoardWithComment extends Tables<'board'> {
  user: {
    id: string;
    name: string;
  };
  board_comments: { count: number }[];
}
