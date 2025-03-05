import { supabase } from "@/lib/supabase/client";
import type { BoardWithRelations } from "@/types";
import { PAGINATION } from "@/utils/constants";
import type { Database } from "@/types/supabase";

type BoardInsert = Database["public"]["Tables"]["board"]["Insert"];

//메인페이지 게시글 목록 가져오기
export const getMainRecentBoards = async () => {
  try {
    const { data, error } = await supabase
      .from("board")
      .select(
        `
      *,
      user!inner(
          id,
          name
        ),
      board_comments(count)
      `
      )
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `메인페이지 게시글 목록을 가져오는데 실패했습니다. ${error.message}`
      );
    }
    throw error;
  }
};

//게시글 목록 가져오기
export const getBoardListByPage = async ({
  page = 1,
  search,
}: {
  page?: number;
  search?: string;
}): Promise<{ data: BoardWithRelations[]; count: number }> => {
  try {
    let query = supabase.from("board").select(
      `
        *,
        board_comments(count),
        board_likes(count),
        user!inner(id, name, avatar_url)
      `,
      { count: "exact" }
    );

    // 검색어가 있으면 제목 필터링
    if (search && search.trim() !== "") {
      query = query.ilike("title", `%${search}%`);
    }

    const { data, error, count } = await query
      .range(
        (page - 1) * PAGINATION.BOARD.ITEMS_PER_PAGE,
        page * PAGINATION.BOARD.ITEMS_PER_PAGE - 1
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { data: data || [], count: count || 0 };
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
            name,
            avatar_url
          ),
          board_comments(count),
          board_likes(count)
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
            name,
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
            name,
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

//자유게시판 조회 count
export const incrementViewCount = async (boardId: number) => {
  try {
    const { data, error } = await supabase.rpc("increment_view_count", {
      row_id: boardId,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`조회수 증가에 실패했습니다. ${error.message}`);
    }
    throw error;
  }
};

//마이페이지 게시글 목록 조회
export const getMyBoards = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("board")
      .select(
        `
          *,
          board_comments(count),
          board_likes(count),
          user!inner(
            id,
            name,
            avatar_url
          )
        `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `내가 쓴 게시글 목록을 가져오는데 실패했습니다. ${error.message}`
      );
    }
    throw error;
  }
};
