import {
  createComment,
  deleteComment,
  getCommentsByBoardId,
  getRepliesByCommentId,
  updateComment,
} from "@/lib/supabase/comment";
import type { CommentInsert, UpdateCommentParams } from "@/types";
import type { Comment } from "@/types/board";
import { useSession } from "@/store/zustand";
import { getAvatarUrl, getDisplayName } from "@/utils/userProfile";
import { type QueryClient, type QueryKey, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

//댓글/대댓글이 담긴 캐시 키 — 대댓글은 부모 id 기준으로 따로 캐시된다
const commentListKey = (boardId: number, parentId?: number | null): QueryKey =>
  parentId ? ["comments", "replies", parentId] : ["comments", boardId];

//낙관적으로 추가한 임시 댓글은 음수 id — 서버 응답 전에는 대댓글·좋아요 조회를 하지 않는다
export const isTempCommentId = (id: number) => id < 0;

type BoardDetailCache = { board_comments: { count: number }[] };

//게시글 상세의 댓글 수(board_comments count) 증감
const adjustCommentCount = (queryClient: QueryClient, boardId: number, diff: number) => {
  queryClient.setQueryData<BoardDetailCache>(["boards", boardId], (old) => {
    if (!old?.board_comments) return old;
    const count = old.board_comments[0]?.count ?? 0;
    return { ...old, board_comments: [{ count: Math.max(0, count + diff) }] };
  });
};

//목록 캐시와 상세 캐시를 함께 스냅샷 — 실패 시 그대로 되돌린다
const snapshot = async (queryClient: QueryClient, listKey: QueryKey, boardId: number) => {
  await queryClient.cancelQueries({ queryKey: listKey });
  await queryClient.cancelQueries({ queryKey: ["boards", boardId], exact: true });
  return {
    listKey,
    previousList: queryClient.getQueryData<Comment[]>(listKey),
    previousBoard: queryClient.getQueryData(["boards", boardId]),
  };
};

type CommentContext = Awaited<ReturnType<typeof snapshot>>;

const rollback = (queryClient: QueryClient, boardId: number, context?: CommentContext) => {
  if (!context) return;
  queryClient.setQueryData(context.listKey, context.previousList);
  queryClient.setQueryData(["boards", boardId], context.previousBoard);
};

//댓글 리스트 가져오기
export const useCommentLists = (boardId: number) => {
  return useQuery({
    queryKey: ["comments", boardId],
    queryFn: () => getCommentsByBoardId(boardId),
  });
};

//대댓글 리스트 가져오기
export const useRepliesCommentList = (commentId: number) => {
  return useQuery({
    queryKey: ["comments", "replies", commentId],
    queryFn: () => getRepliesByCommentId(commentId),
    enabled: !isTempCommentId(commentId),
  });
};

//댓글 작성
export const useAddComment = (boardId: number) => {
  const queryClient = useQueryClient();
  const session = useSession();
  return useMutation({
    mutationFn: createComment,
    onMutate: async (variables: Omit<CommentInsert, "created_at">) => {
      const context = await snapshot(queryClient, commentListKey(boardId, variables.parent_id), boardId);

      const tempComment: Comment = {
        id: -Date.now(),
        board_id: boardId,
        user_id: variables.user_id ?? null,
        content: variables.content ?? null,
        parent_id: variables.parent_id ?? null,
        created_at: new Date().toISOString(),
        user: { name: getDisplayName(session?.user), avatar_url: getAvatarUrl(session?.user) ?? "" },
        likes: [{ count: 0 }],
      };
      queryClient.setQueryData<Comment[]>(context.listKey, (old) => [...(old ?? []), tempComment]);
      adjustCommentCount(queryClient, boardId, 1);

      return context;
    },
    onError: (_error, _variables, context) => rollback(queryClient, boardId, context),
    onSuccess: (newComment) => {
      //게시글 작성자에게 푸시 알림 (실패해도 댓글 흐름에는 영향 없음)
      fetch("/api/push/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ boardId, commentId: newComment.id }),
      }).catch(() => {});
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: commentListKey(boardId, variables.parent_id) });
      queryClient.invalidateQueries({ queryKey: ["boards", boardId] });
    },
  });
};

//댓글 삭제
export const useDeleteComment = (boardId: number, commentId: number, parentId?: number | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteComment(commentId),
    onMutate: async () => {
      const context = await snapshot(queryClient, commentListKey(boardId, parentId), boardId);
      queryClient.setQueryData<Comment[]>(context.listKey, (old) => old?.filter((comment) => comment.id !== commentId));
      adjustCommentCount(queryClient, boardId, -1);
      return context;
    },
    onError: (_error, _variables, context) => rollback(queryClient, boardId, context),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: commentListKey(boardId, parentId) });
      queryClient.invalidateQueries({ queryKey: ["boards", boardId] });
    },
  });
};

//댓글 수정
export const useEditComment = (boardId: number, parentId?: number | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, content }: UpdateCommentParams) => updateComment(commentId, { content }),
    onMutate: async ({ commentId, content }: UpdateCommentParams) => {
      const context = await snapshot(queryClient, commentListKey(boardId, parentId), boardId);
      queryClient.setQueryData<Comment[]>(context.listKey, (old) =>
        old?.map((comment) => (comment.id === commentId ? { ...comment, content } : comment)),
      );
      return context;
    },
    onError: (_error, _variables, context) => rollback(queryClient, boardId, context),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: commentListKey(boardId, parentId) });
    },
  });
};
