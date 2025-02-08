import {
  createBoard,
  deleteBoard,
  getBoardDetail,
  getBoardListByPage,
  updateBoard,
} from "@/lib/supabase/board";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UpdateBoardParams } from "@/types";

//게시글 목록
export const useBoards = (page: number = 1) => {
  return useQuery({
    queryKey: ["boards", page],
    queryFn: () => getBoardListByPage({ page }),
  });
};

//게시글 상세 페이지
export const useBoardDetail = (boardId: number) => {
  return useQuery({
    queryKey: ["board", boardId],
    queryFn: () => getBoardDetail(boardId),
  });
};

//게시글 추가
export const useAddBoard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["boards"],
      });
    },
  });
};

//게시글 수정
export const useUpdateBoard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ boardId, title, content }: UpdateBoardParams) =>
      updateBoard(boardId, { title, content }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["board", variables.boardId],
      });
      queryClient.invalidateQueries({
        queryKey: ["boards"],
      });
    },
  });
};

//게시글 삭제
export const useDeleteBoard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["boards"],
      });
    },
  });
};
