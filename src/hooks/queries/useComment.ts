import {
  createComment,
  deleteComment,
  getCommentsByBoardId,
  getRepliesByCommentId,
  updateComment,
} from '@/lib/supabase/comment';
import type { UpdateCommentParams } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

//댓글 리스트 가져오기
export const useCommentLists = (boardId: number) => {
  return useQuery({
    queryKey: ['comments', boardId],
    queryFn: () => getCommentsByBoardId(boardId),
  });
};

//대댓글 리스트 가져오기
export const useRepliesCommentList = (commentId: number) => {
  return useQuery({
    queryKey: ['comments', 'replies', commentId],
    queryFn: () => getRepliesByCommentId(commentId),
  });
};

//댓글 작성
export const useAddComment = (boardId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createComment,
    onSuccess: (newComment) => {
      if (newComment.parent_id) {
        queryClient.invalidateQueries({
          queryKey: ['comments', 'replies', newComment.parent_id],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ['comments', boardId],
      });

      queryClient.invalidateQueries({
        queryKey: ['boards', boardId],
      });
    },
  });
};

//댓글 삭제
export const useDeleteComment = (boardId: number, commentId: number, parentId?: number | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteComment(commentId),
    onSuccess: () => {
      if (parentId) {
        queryClient.invalidateQueries({
          queryKey: ['comments', 'replies', parentId],
        });
      }
      
      queryClient.invalidateQueries({
        queryKey: ['comments', boardId],
      });

      queryClient.invalidateQueries({
        queryKey: ['boards', boardId],
      });
    },
  });
};

//댓글 수정
export const useEditComment = (boardId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, content }: UpdateCommentParams) => updateComment(commentId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments', 'replies'],
      });
      queryClient.invalidateQueries({
        queryKey: ['comments', boardId],
      });
    },
  });
};
