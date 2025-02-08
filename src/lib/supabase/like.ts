import { supabase } from "@/lib/supabase/client";

//자유게시판 좋아요 추가
export const addBoardLike = async (boardId: number, userId: string) => {
  try {
    const { data, error } = await supabase
      .from("board_likes")
      .insert({
        board_id: boardId,
        user_id: userId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`좋아요 추가에 실패했습니다. ${error.message}`);
    }
    throw error;
  }
};

//자유게시판 좋아요 삭제
export const removeBoardLike = async (boardId: number, userId: string) => {
  try {
    const { data, error } = await supabase
      .from("board_likes")
      .delete()
      .eq("board_id", boardId)
      .eq("user_id", userId);

    if (error) throw error;
    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`좋아요 삭제에 실패했습니다. ${error.message}`);
    }
    throw error;
  }
};
