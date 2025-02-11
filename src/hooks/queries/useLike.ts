import { getLikeStatus, toggleBoardLike } from "@/lib/supabase/like";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

//좋아요 상태 조회
export const useLikeStatus = (boardId: number, userId?: string) => {
  return useQuery({
    queryKey: ["boardLike", boardId, userId],
    queryFn: () => getLikeStatus(boardId, userId),
    enabled: !!userId,
    staleTime: 0,
  });
};

//좋아요 추가
export const useToggleLike = (boardId: number, userId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => toggleBoardLike(boardId, userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["boardLike", boardId, userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["board", boardId],
      });
      queryClient.invalidateQueries({
        queryKey: ["boards"],
      });
    },
  });
};
