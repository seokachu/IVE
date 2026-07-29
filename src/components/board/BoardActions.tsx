import { Button } from "@/components/ui/button";
import Search from "@/components/common/search/Search";
import { PlusCircle } from "lucide-react";
import type { BoardActionsProps } from "@/types/board";

const BoardActions = ({ onSearch, onClickWrite }: BoardActionsProps) => {
  return (
    <div className="flex items-center justify-end gap-3 flex-col lg:flex-row lg:w-2/3">
      <div className="relative w-full lg:max-w-80">
        <Search
          onSearch={onSearch}
          className="pl-10 pr-4 py-2 border rounded-md"
          placeholder="검색어를 입력하세요."
          iconClassName="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
      </div>
      <Button
        onClick={onClickWrite}
        size="auto"
        className="flex items-center justify-center gap-2 px-4 py-2 w-full lg:w-28 text-base lg:text-sm"
        aria-label="글쓰기"
      >
        <PlusCircle className="w-5 h-5 translate-y-[1px]" />
        <span>글쓰기</span>
      </Button>
    </div>
  );
};

export default BoardActions;
