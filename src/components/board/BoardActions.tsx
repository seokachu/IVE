import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Search from "@/components/common/search/Search";
import { Check, ChevronDown, PencilLine } from "lucide-react";
import { BOARD_FILTER_PILLS, BOARD_SORT_OPTIONS } from "@/utils/constants";
import type { BoardActionsProps } from "@/types/board";

//자유게시판 툴바 — 시안 확정: 필터 필 + 정렬 + 검색 + 글쓰기 한 줄 정리
const BoardActions = ({
  filter,
  sort,
  onFilterChange,
  onSortChange,
  onSearch,
  onClickWrite,
}: BoardActionsProps) => {
  const sortLabel =
    BOARD_SORT_OPTIONS.find((option) => option.value === sort)?.label ?? "최신순";

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
      <ul className="flex items-center gap-0.5 p-1 rounded-full bg-gray-100 self-start overflow-x-auto max-w-full">
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
        <DropdownMenu>
          <DropdownMenuTrigger
            className="shrink-0 flex items-center gap-1.5 h-10 px-4 rounded-full border border-gray-200 bg-card text-[13px] font-semibold hover:bg-gray-50 transition-colors"
            aria-label="정렬 기준 선택"
          >
            {sortLabel}
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="min-w-[140px] rounded-[14px] border-gray-200 shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-1.5"
          >
            {BOARD_SORT_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onSortChange(option.value)}
                className={`justify-between gap-2.5 rounded-lg px-3 py-2.5 text-sm ${
                  option.value === sort
                    ? "font-bold text-purple-500 dark:text-purple-300"
                    : ""
                }`}
              >
                {option.label}
                {option.value === sort && <Check size={15} aria-hidden="true" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
