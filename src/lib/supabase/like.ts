import { supabase } from "@/lib/supabase/client";

//자유게시판 Like 불러오기
export const getLikeStatus = async (boardId: number, userId?: string) => {
  try {
    if (!userId) return false;
    const { error } = await supabase
      .from("board_likes")
      .select("id")
      .eq("board_id", boardId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw error;
    return false;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`좋아요 수를 가져오는데 실패했습니다. ${error.message}`);
    }
    throw error;
  }
};

//자유게시판 Toggle
export const toggleBoardLike = async (boardId: number, userId: string) => {
  try {
    //좋아요 상태 확인
    const { data: existingLike } = await supabase
      .from("board_likes")
      .select("id")
      .eq("board_id", boardId)
      .eq("user_id", userId)
      .maybeSingle();

    if (existingLike) {
      await supabase
        .from("board_likes")
        .delete()
        .eq("board_id", boardId)
        .eq("user_id", userId);
      return false; //취소
    } else {
      await supabase
        .from("board_likes")
        .insert([{ board_id: boardId, user_id: userId }]);
      return true; //추가
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`좋아요 처리에 실패했습니다. ${error.message}`);
    }
    throw error;
  }
};
