import { addBoardLike, removeBoardLike } from "@/lib/supabase/like";
import { useMutation, useQueryClient } from "@tanstack/react-query";

//좋아요 추가
export const useAddLike = (boardId: number, userId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => addBoardLike(boardId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["board", boardId],
      });
      queryClient.invalidateQueries({
        queryKey: ["boards"],
      });
    },
  });
};

//좋아요 삭제
export const useDeleteLike = (boardId: number, userId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => removeBoardLike(boardId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["board", boardId],
      });
      queryClient.invalidateQueries({
        queryKey: ["boards"],
      });
    },
  });
};
