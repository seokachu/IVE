import {
  createBoard,
  deleteBoard,
  getBoardDetail,
  getBoardListByPage,
  getMainRecentBoards,
  getMyBoards,
  incrementViewCount,
  updateBoard,
} from "@/lib/supabase/board";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { BoardsResponse, UpdateBoardParams } from "@/types";

//메인페이지 게시글 목록 불러오기
export const useMainRecentBoards = () => {
  return useQuery({
    queryKey: ["mainRecentBoards"],
    queryFn: getMainRecentBoards,
  });
};

//게시글 목록
export const useBoards = (page: number = 1) => {
  return useQuery({
    queryKey: ["boards", page],
    queryFn: () => getBoardListByPage({ page }),
  });
};

//게시글 상세 페이지
export const useBoardDetail = (boardId: number | undefined) => {
  return useQuery({
    queryKey: ["board", boardId],
    queryFn: () => getBoardDetail(boardId as number),
    enabled: !!boardId,
    staleTime: 0,
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
export const useDeleteBoard = (boardId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteBoard(boardId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["boards"],
      });
    },
  });
};

//게시글 리스트 조회수 count
export const useIncrementViewCount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: incrementViewCount,
    onMutate: async (boardId: number) => {
      await queryClient.cancelQueries({
        queryKey: ["boards"],
      });

      //이전 데이터 저장
      const previousData = queryClient.getQueryData<BoardsResponse>(["boards"]);

      //낙관적 업데이트
      queryClient.setQueryData<BoardsResponse>(["boards"], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((board) =>
            board.id === boardId
              ? { ...board, views: (board.views || 0) + 1 }
              : board
          ),
        };
      });

      return { previousData };
    },
    onError: (_error, _boardId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["boards"], context.previousData);
      }
    },
    onSuccess: (_data, boardId) => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
    },
  });
};

//마이페이지 게시글 목록 조회
export const useMyBoards = (userId?: string) => {
  return useQuery({
    queryKey: ["myBoards", userId],
    queryFn: () => getMyBoards(userId!),
    enabled: !!userId,
  });
};
