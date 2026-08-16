"use client";
import BoardList from "./BoardList";
import BoardActions from "./BoardActions";
import BoardNoticeRow from "./BoardNoticeRow";
import { useRouter, useSearchParams } from "next/navigation";
import { useBoards } from "@/hooks/queries/useBoard";
import { useEffect, useRef, useState } from "react";
import PaginationControl from "@/components/common/PaginationControl";
import Error from "@/components/common/error/Error";
import BoardSkeleton from "@/components/common/loading/BoardSkeleton";
import SearchLoading from "../common/loading/SearchLoading";
import { BOARD_FILTER_PILLS, PAGINATION } from "@/utils/constants";
import useAuthGuard from "@/hooks/useAuthGuard";
import { useSession } from "@/store/zustand";
import { Megaphone, Pencil, PencilLine, Search, User } from "lucide-react";
import BoardEmptyState from "./BoardEmptyState";
import LoginLink from "@/components/auth/login/LoginLink";
import type { BoardFilterValue, BoardSortValue } from "@/types/board";

const isBoardFilter = (value: string | null): value is BoardFilterValue =>
  BOARD_FILTER_PILLS.some((pill) => pill.value === value);

const BoardContainer = () => {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const session = useSession();
  const isFirstLoad = useRef(true);
  const listTopRef = useRef<HTMLDivElement>(null);
  const [searchKeyWord, setSearchKeyWord] = useState(
    searchParams.get("search") || ""
  );
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1", 10)
  );

  //필터·정렬은 URL 파라미터에서 파생 (HOT 3 "인기글 전체 보기" 링크와 자연 동기화)
  const filterParam = searchParams.get("filter");
  const filter: BoardFilterValue = isBoardFilter(filterParam)
    ? filterParam
    : "all";
  const sortParam = searchParams.get("sort");
  const sort: BoardSortValue =
    sortParam === "popular" || sortParam === "comments" ? sortParam : "latest";
  const effectiveSort: BoardSortValue = filter === "popular" ? "popular" : sort;

  //상세 작성자 카드의 "이 다이브의 다른 글" 진입 — author 파라미터로 특정 작성자 글만
  const authorParam = searchParams.get("author") || undefined;
  const userId = filter === "mine" ? session?.user.id : authorParam;
  const isListEnabled =
    filter !== "notice" && !(filter === "mine" && !session);

  const {
    data: boardList,
    isLoading,
    isError,
  } = useBoards(currentPage, searchKeyWord, effectiveSort, userId, isListEnabled);
  const { checkAuth } = useAuthGuard();

  useEffect(() => {
    if (!isLoading) {
      isFirstLoad.current = false;
    }
  }, [isLoading]);

  const totalPages = Math.ceil(
    (boardList?.count || 0) / PAGINATION.BOARD.ITEMS_PER_PAGE
  );

  if (isLoading && isFirstLoad.current) return <BoardSkeleton />;
  if (isError) return <Error />;

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    const queryString = params.toString();
    //필터·정렬 전환 시 히어로 상단으로 튀지 않게 스크롤 유지
    push(queryString ? `/board?${queryString}` : "/board", { scroll: false });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateParams({
      page: page.toString(),
      search: searchKeyWord || null,
    });
    //페이지 이동은 리스트 상단(툴바)으로 복귀
    listTopRef.current?.scrollIntoView();
  };

  const handleSearch = (value: string) => {
    setSearchKeyWord(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (nextFilter: BoardFilterValue) => {
    if (nextFilter === "mine" && !checkAuth()) return;
    setCurrentPage(1);
    updateParams({
      filter: nextFilter === "all" ? null : nextFilter,
      author: null,
      page: null,
    });
  };

  const handleSortChange = (nextSort: BoardSortValue) => {
    setCurrentPage(1);
    updateParams({
      sort: nextSort === "latest" ? null : nextSort,
      //인기 필터에서 정렬을 바꾸면 전체 필터로 복귀
      filter: filter === "popular" || filter === "all" ? null : filter,
      page: null,
    });
  };

  const onClickBoardWrite = () => {
    if (!checkAuth()) return;
    push("board/write");
  };

  //시안 기준: 빈 상태 CTA — 글쓰기(보라 필) · 로그인(아웃라인 필)
  const writeAction = (
    <button
      type="button"
      onClick={onClickBoardWrite}
      className="inline-flex items-center gap-1.5 rounded-full bg-purple px-6 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-purple-400"
    >
      <Pencil size={13} aria-hidden />
      글쓰기
    </button>
  );

  const renderEmptyState = () => {
    if (searchKeyWord) {
      return <BoardEmptyState Icon={Search} tone="gray" title="검색 결과가 없어요" description="다른 키워드로 다시 검색해보세요" />;
    }
    if (filter === "mine") {
      return (
        <BoardEmptyState
          Icon={PencilLine}
          title="아직 작성한 글이 없어요"
          description="첫 번째 글로 다이브를 시작해보세요!"
          action={writeAction}
        />
      );
    }
    if (authorParam) {
      return <BoardEmptyState Icon={PencilLine} title="이 다이브가 남긴 글이 아직 없어요" />;
    }
    return (
      <BoardEmptyState
        Icon={PencilLine}
        title="아직 게시글이 없어요"
        description="첫 번째 글로 다이브를 시작해보세요!"
        action={writeAction}
      />
    );
  };

  //검색 내용 보여주는 함수
  const renderBoardContent = () => {
    //로그인이 필요한 필터
    if (filter === "mine" && !session) {
      return (
        <BoardEmptyState
          Icon={User}
          title="로그인 후 내가 쓴 글을 볼 수 있어요"
          description="다이브 계정으로 로그인해주세요"
          action={
            <LoginLink className="inline-flex items-center rounded-full border border-purple bg-background px-6 py-2.5 text-[13px] font-semibold text-purple-500 transition-colors hover:bg-purple-50">
              로그인
            </LoginLink>
          }
        />
      );
    }

    //검색 중 일때
    if (isLoading && !isFirstLoad.current) {
      return <SearchLoading />;
    }

    // 데이터가 없거나 검색 결과가 없을 때
    if (boardList && boardList.data.length === 0) {
      return renderEmptyState();
    }
    return <BoardList boards={boardList} keyword={searchKeyWord} />;
  };

  const showNotice =
    (filter === "all" || filter === "notice") && !searchKeyWord;

  return (
    <div ref={listTopRef} className="scroll-mt-6">
      <BoardActions
        filter={filter}
        sort={effectiveSort}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onSearch={handleSearch}
        onClickWrite={onClickBoardWrite}
      />
      {/* 어떤 필터든 콘텐츠가 적을 때 푸터가 딸려 올라오지 않게 최소 높이 확보 */}
      <div className="mt-5 flex min-h-[420px] flex-col gap-5 lg:mt-6">
        {showNotice && <BoardNoticeRow />}
        {filter === "notice" && (
          <BoardEmptyState
            Icon={Megaphone}
            title="등록된 공지는 여기까지예요"
            description="새로운 소식은 전체 탭에서 확인해보세요"
            action={
              <button
                type="button"
                onClick={() => handleFilterChange("all")}
                className="inline-flex items-center rounded-full border border-purple bg-background px-6 py-2.5 text-[13px] font-semibold text-purple-500 transition-colors hover:bg-purple-50"
              >
                전체 글 보기
              </button>
            }
          />
        )}
        {filter !== "notice" && renderBoardContent()}
      </div>
      {filter !== "notice" && totalPages > 1 && (
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          maxDisplayPages={PAGINATION.BOARD.MAX_DISPLAY_PAGES}
        />
      )}
    </div>
  );
};

export default BoardContainer;
