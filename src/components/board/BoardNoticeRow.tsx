import { ChevronRight } from "lucide-react";
import { BOARD_NOTICE } from "@/utils/constants";

//리스트 최상단 고정 공지 로우
const BoardNoticeRow = () => {
  return (
    <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-purple-50 mb-3">
      <span className="shrink-0 px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-500 dark:text-purple-300">
        공지
      </span>
      <p className="flex-1 min-w-0 truncate text-sm font-semibold">{BOARD_NOTICE.title}</p>
      <ChevronRight className="w-4 h-4 shrink-0 text-gray-400" aria-hidden="true" />
    </div>
  );
};

export default BoardNoticeRow;
