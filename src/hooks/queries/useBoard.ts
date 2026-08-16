import {
  createBoard,
  deleteBoard,
  getAdjacentBoards,
  getAuthorPostCount,
  getBoardDetail,
  getBoardListByPage,
  getBoardStats,
  getHotBoards,
  getMainRecentBoards,
  getMyBoards,
  incrementViewCount,
  updateBoard,
} from "@/lib/supabase/board";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  BoardSortValue,
  BoardsResponse,
  UpdateBoardParams,
} from "@/types/board";

//메인페이지 게시글 목록 불러오기
export const useMainRecentBoards = () => {
  return useQuery({
    queryKey: ["boards"],
    queryFn: getMainRecentBoards,
  });
};

//메인 Hot Board 인기글
export const useHotBoards = () => {
  return useQuery({
    queryKey: ["hotBoards"],
    queryFn: getHotBoards,
  });
};

//게시글 목록
export const useBoards = (
  page: number = 1,
  search?: string,
  sort: BoardSortValue = "latest",
  userId?: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["boards", page, search, sort, userId],
    queryFn: () => getBoardListByPage({ page, search, sort, userId }),
    enabled,
  });
};

//자유게시판 히어로 커뮤니티 스탯
export const useBoardStats = () => {
  return useQuery({
    queryKey: ["boardStats"],
    queryFn: getBoardStats,
    staleTime: 1000 * 60 * 5,
  });
};

//이전/다음 글
export const useAdjacentBoards = (createdAt?: string) => {
  return useQuery({
    queryKey: ["adjacentBoards", createdAt],
    queryFn: () => getAdjacentBoards(createdAt as string),
    enabled: !!createdAt,
  });
};

//작성자가 쓴 글 수
export const useAuthorPostCount = (userId?: string | null) => {
  return useQuery({
    queryKey: ["authorPostCount", userId],
    queryFn: () => getAuthorPostCount(userId as string),
    enabled: !!userId,
  });
};

//게시글 상세 페이지
export const useBoardDetail = (boardId: number | undefined) => {
  return useQuery({
    queryKey: ["boards", boardId],
    queryFn: () => getBoardDetail(boardId as number),
    enabled: !!boardId,
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
        queryKey: ["boards", variables.boardId],
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });
};

//마이페이지 게시글 목록 조회
export const useMyBoards = (userId?: string) => {
  return useQuery({
    queryKey: ["boards", userId],
    queryFn: () => getMyBoards(userId!),
    enabled: !!userId,
  });
};
