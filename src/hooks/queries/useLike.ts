import {
  getCommentLikeStatus,
  getLikeStatus,
  toggleBoardLike,
  toggleCommentLike,
} from "@/lib/supabase/like";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

//자유게시판 좋아요 상태 조회
export const useLikeStatus = (boardId: number, userId?: string) => {
  return useQuery({
    queryKey: ["boards", "like", boardId, userId],
    queryFn: () => getLikeStatus(boardId, userId),
    enabled: !!userId,
  });
};

//자유게시판 좋아요 추가
export const useToggleLike = (boardId: number, userId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => toggleBoardLike(boardId, userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["boards"],
      });
    },
  });
};

//자유게시판 댓글 좋아요 상태 조회
export const useCommentLikeStatus = (commentId: number, userId?: string) => {
  return useQuery({
    queryKey: ["comments", "like", commentId, userId],
    queryFn: () => getCommentLikeStatus(commentId, userId),
    enabled: !!userId,
  });
};

//자유게시판 댓글 좋아요 추가
export const useToggleCommentLike = (commentId: number, userId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => toggleCommentLike(commentId, userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
    },
  });
};
