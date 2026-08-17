import { Button } from "@/components/ui/button";
import Search from "@/components/common/search/Search";
import SortDropdown from "@/components/common/select/SortDropdown";
import { PencilLine } from "lucide-react";
import { BOARD_FILTER_PILLS, BOARD_SORT_OPTIONS } from "@/utils/constants";
import type { BoardActionsProps, BoardSortValue } from "@/types/board";

//자유게시판 툴바 — 시안 확정: 필터 필 + 정렬 + 검색 + 글쓰기 한 줄 정리
const BoardActions = ({
  filter,
  sort,
  onFilterChange,
  onSortChange,
  onSearch,
  onClickWrite,
}: BoardActionsProps) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
      <ul className="scrollbar-hide flex items-center gap-0.5 p-1 rounded-full bg-gray-100 self-start overflow-x-auto max-w-full">
        {BOARD_FILTER_PILLS.map((pill) => (
          <li key={pill.value} className="shrink-0">
            <button
              type="button"
              onClick={() => onFilterChange(pill.value)}
              aria-pressed={filter === pill.value}
              className={`px-4 py-1.5 rounded-full text-[13px] whitespace-nowrap transition-colors ${
                filter === pill.value
                  ? "bg-card shadow-sm font-bold text-purple-500 dark:text-purple-300"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {pill.label}
            </button>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-2.5">
        <SortDropdown
          options={BOARD_SORT_OPTIONS}
          value={sort}
          onChange={(value) => onSortChange(value as BoardSortValue)}
        />
        <div className="relative flex-1 lg:flex-none lg:w-[240px]">
          <Search
            onSearch={onSearch}
            className="pl-10 pr-4 h-10 w-full rounded-full border-gray-300 bg-card"
            placeholder="제목 검색"
            iconClassName="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
        <Button
          onClick={onClickWrite}
          size="auto"
          className="shrink-0 flex items-center gap-1.5 h-10 px-5 rounded-full"
          aria-label="글쓰기"
        >
          <PencilLine className="w-4 h-4" aria-hidden="true" />
          <span>글쓰기</span>
        </Button>
      </div>
    </div>
  );
};

export default BoardActions;
