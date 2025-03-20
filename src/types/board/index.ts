import { BoardCommentType } from '@/hooks/user';
import { UseFormReturn } from 'react-hook-form';
import type { Tables } from '../supabase';

export type CommentMode = 'create' | 'edit';
export type CommentType = 'comment' | 'reply';
export type BoardWriteFormProps = CreateBoardWriteFormProps | EditBoardWriteFormProps;
export type ButtonMode = 'default' | 'edit';

export interface BoardWithComment extends Tables<'board'> {
  user: {
    id: string;
    name: string;
  };
  board_comments: { count: number }[];
}

export interface BoardWithRelations extends Tables<'board'> {
  board_comments: [{ count: number }];
  board_likes: [{ count: number }];
  user: {
    name: string;
    avatar_url: string;
  };
}

export interface BoardListItemProps {
  item: BoardWithRelations;
  keyword?: string;
}

export interface BoardListProps {
  boards:
    | {
        data: BoardWithRelations[];
        count: number;
      }
    | undefined;
  keyword?: string;
}

export interface BoardDetailPageParams {
  params: {
    id: string;
  };
}

export interface BoardDetailContainerProps {
  boardId: number;
}

export interface BoardDetailProps {
  item: BoardWithRelations;
}

export interface BoardDetailHeaderProps {
  item: BoardWithRelations;
  isAuthor: boolean;
  onClickDelete: () => void;
  onClickEdit: () => void;
}

export interface Comment extends Tables<'board_comments'> {
  user: {
    name: string;
    avatar_url: string;
  };
  likes: { count: number }[];
}

export interface CommentListItemProps {
  boardId: number;
  item: Comment;
  activeEditId: number | null;
  handleEditChange: (id: number | null) => void;
}

export interface BoardsResponse {
  data: BoardWithRelations[];
  count: number;
}

export interface EditPageParams {
  params: {
    id: string;
  };
}
export interface CreateBoardWriteFormProps {
  mode: 'create';
}

export interface EditBoardWriteFormProps {
  mode: 'edit';
  boardId: number;
}

export interface CommentFormProps {
  mode: CommentMode;
  type: CommentType;
  parentId?: number;
  initialContent?: string | null;
  commentId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export interface BoardActionButtonProps {
  mode: ButtonMode;
  onEdit: () => void;
  onDelete: () => void;
}

export interface ThreadViewProps {
  form: UseFormReturn<BoardCommentType>;
  onSubmit: (e: React.FormEvent) => void;
  placeholder: string;
  submitButtonLabel: string;
  onContentChange?: () => void;
}

export type UpdateBoardParams = {
  boardId: number;
  title: string;
  content: string;
};
