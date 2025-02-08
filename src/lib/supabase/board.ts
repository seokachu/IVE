import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

type BoardInsert = Database["public"]["Tables"]["board"]["Insert"];

const BOARD_PAGE = 10;

//게시글 목록 가져오기
export const getBoardListByPage = async ({ page = 1 }) => {
  try {
    const { data, error } = await supabase
      .from("board")
      .select(
        `*,
        user:user_id (
          nickname,
          avatar_url
        ),
        likes:board_likes(count),
        user_has_liked:board_likes!inner(user_id)
        `
      )
      .range((page - 1) * BOARD_PAGE, page * BOARD_PAGE - 1)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `게시글 목록을 가져오는데 실패했습니다. ${error.message}`
      );
    }
    throw error;
  }
};

//게시글 상세 목록 가져오기
export const getBoardDetail = async (boardId: number) => {
  try {
    const { data, error } = await supabase
      .from("board")
      .select(
        `
          *,
          user:user_id (
            nickname,
            avatar_url
          ),
          likes:board_likes(count),
          user_has_liked:board_likes!inner(user_id)
        `
      )
      .eq("id", boardId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `게시글 목록을 가져오는데 실패했습니다. ${error.message}`
      );
    }
    throw error;
  }
};

//게시글 추가하기
export const createBoard = async ({
  user_id,
  title,
  content,
}: Omit<BoardInsert, "created_at">) => {
  try {
    const { data, error } = await supabase
      .from("board")
      .insert({
        user_id,
        title,
        content,
      })
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
      throw new Error(`게시글 작성에 실패했습니다. ${error.message}`);
    }
    throw error;
  }
};

//게시글 수정
export const updateBoard = async (
  boardId: number,
  { title, content }: Pick<BoardInsert, "title" | "content">
) => {
  try {
    const { data, error } = await supabase
      .from("board")
      .update({ title, content })
      .eq("id", boardId)
      .select(
        `
          *,
          user:user_id(
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
      throw new Error(`게시글 수정에 실패했습니다. ${error.message}`);
    }
    throw error;
  }
};

//게시글 삭제
export const deleteBoard = async (boardId: number) => {
  try {
    const { error } = await supabase.from("board").delete().eq("id", boardId);
    if (error) throw error;
    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`게시글 삭제에 실패했습니다. ${error.message}`);
    }
    throw error;
  }
};
