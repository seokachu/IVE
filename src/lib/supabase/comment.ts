import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

type CommentInsert = Database["public"]["Tables"]["board_comments"]["Insert"];

//댓글 목록 가져오기
export const getCommentsByBoardId = async (boardId: number) => {
  try {
    const { data, error } = await supabase
      .from("board_comments")
      .select(
        `
      *,
      user:user_id (
        nickname,
        avatar_url
      ),
      likes:comment_likes(count)
      `
      )
      .eq("board_id", boardId)
      .is("parent_id", null)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`댓글 목록을 가져오는데 실패했습니다. ${error.message}`);
    }
    throw error;
  }
};

//대댓글 가져오기
export const getRepliesByCommentId = async (commentId: number) => {
  try {
    const { data, error } = await supabase
      .from("board_comments")
      .select(
        `
      *,
      user:user_id (
        nickname,
        avatar_url
      ),
      likes:comment_likes(count)
      `
      )
      .eq("parent_id", commentId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `대댓글 목록을 가져오는데 실패했습니다. ${error.message}`
      );
    }
    throw error;
  }
};

//댓글 작성
export const createComment = async ({
  board_id,
  user_id,
  content,
  parent_id = null,
}: Omit<CommentInsert, "created_at">) => {
  try {
    const { data, error } = await supabase
      .from("board_comments")
      .insert({ board_id, user_id, content, parent_id })
      .select(
        `
        *,
        user:user_id (
          nickname,
          avatar_url
        )
        `
      )
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`댓글 작성에 실패했습니다. ${error.message}`);
    }
    throw error;
  }
};

//댓글 수정
export const updateComment = async (
  commentId: number,
  { content }: Pick<CommentInsert, "content">
) => {
  try {
    const { data, error } = await supabase
      .from("board_comments")
      .update({ content })
      .eq("id", commentId)
      .select(
        `
        *,
        user:user_id (
          nickname,
          avatar_url
        )
        `
      )
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`댓글을 수정하는데 실패했습니다. ${error.message}`);
    }
    throw error;
  }
};

//댓글 삭제
export const deleteComment = async (commentId: number) => {
  try {
    const { error } = await supabase
      .from("board_comments")
      .delete()
      .eq("id", commentId);

    if (error) throw error;
    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`댓글을 삭제하는데 실패했습니다. ${error.message}`);
    }
    throw error;
  }
};
