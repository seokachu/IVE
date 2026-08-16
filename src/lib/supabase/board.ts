import { supabase } from "@/lib/supabase/client";
import { PAGINATION } from "@/utils/constants";
import { extractFirstImage } from "@/utils/extractImage";
import type { BoardInsert } from "@/types";
import type {
  AdjacentBoards,
  BoardSortValue,
  BoardStats,
  BoardSummary,
} from "@/types/board";

//메인페이지 게시글 목록 가져오기
//메인 Hot Board — 인기순(좋아요 → 댓글 순) 상위 6건
export const getHotBoards = async () => {
  try {
    const { data, error } = await supabase
      .from("board_with_meta")
      .select("*")
      .order("like_count", { ascending: false })
      .order("comment_count", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`인기 게시글 목록을 가져오는데 실패했습니다. ${error.message}`);
    }
    throw error;
  }
};

export const getMainRecentBoards = async () => {
  try {
    const { data, error } = await supabase
      .from("board_with_meta")
      .select("*")
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
  sort = "latest",
  userId,
}: {
  page?: number;
  search?: string;
  sort?: BoardSortValue;
  userId?: string;
}): Promise<{ data: BoardSummary[]; count: number }> => {
  try {
    let query = supabase
      .from("board_with_meta")
      .select("*", { count: "exact" });

    // 검색어가 있으면 제목 필터링
    if (search && search.trim() !== "") {
      query = query.ilike("title", `%${search}%`);
    }

    // 내가 쓴 글 필터링
    if (userId) {
      query = query.eq("user_id", userId);
    }

    // 정렬 — 인기순(좋아요)·댓글순은 최신순을 2차 기준으로
    if (sort === "popular") {
      query = query.order("like_count", { ascending: false });
    } else if (sort === "comments") {
      query = query.order("comment_count", { ascending: false });
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(
        (page - 1) * PAGINATION.BOARD.ITEMS_PER_PAGE,
        page * PAGINATION.BOARD.ITEMS_PER_PAGE - 1
      );

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

//자유게시판 히어로 커뮤니티 스탯 — 전체 글 · 오늘 새 글 · 누적 댓글
export const getBoardStats = async (): Promise<BoardStats> => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [total, today, comments] = await Promise.all([
      supabase.from("board").select("*", { count: "exact", head: true }),
      supabase
        .from("board")
        .select("*", { count: "exact", head: true })
        .gte("created_at", todayStart.toISOString()),
      supabase
        .from("board_comments")
        .select("*", { count: "exact", head: true }),
    ]);

    const firstError = total.error || today.error || comments.error;
    if (firstError) throw firstError;

    return {
      totalPosts: total.count ?? 0,
      todayPosts: today.count ?? 0,
      totalComments: comments.count ?? 0,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `게시판 통계를 가져오는데 실패했습니다. ${error.message}`
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
          board_comments!board_comments_board_id_fkey(count),
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

//이전(더 최신)·다음(더 오래된) 글 — 목록 최신순 기준
export const getAdjacentBoards = async (
  createdAt: string
): Promise<AdjacentBoards> => {
  try {
    const [prev, next] = await Promise.all([
      supabase
        .from("board")
        .select("id, title")
        .gt("created_at", createdAt)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("board")
        .select("id, title")
        .lt("created_at", createdAt)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    const firstError = prev.error || next.error;
    if (firstError) throw firstError;

    return { prev: prev.data, next: next.data };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `이전/다음 글을 가져오는데 실패했습니다. ${error.message}`
      );
    }
    throw error;
  }
};

//작성자가 쓴 글 수 — 상세 작성자 카드
export const getAuthorPostCount = async (userId: string) => {
  try {
    const { count, error } = await supabase
      .from("board")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (error) throw error;
    return count ?? 0;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `작성자 글 수를 가져오는데 실패했습니다. ${error.message}`
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
    const thumbnail = extractFirstImage(content ?? "");
    const { data, error } = await supabase
      .from("board")
      .insert({
        user_id,
        title,
        content,
        thumbnail,
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
    const thumbnail = extractFirstImage(content ?? "");

    const { data, error } = await supabase
      .from("board")
      .update({ title, content, thumbnail })
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
          board_comments!board_comments_board_id_fkey(count),
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
