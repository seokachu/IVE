import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import type { CommentSectionProps, CommentSortValue } from "@/types/board";

const CommentSection = ({ commentCount, boardAuthorId }: CommentSectionProps) => {
  const [sort, setSort] = useState<CommentSortValue>("oldest");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-lg lg:text-xl font-bold">
          댓글{" "}
          <span className="text-purple-500 dark:text-purple-300">
            {commentCount}
          </span>
          개
        </p>
        <button
          type="button"
          onClick={() =>
            setSort((prev) => (prev === "oldest" ? "latest" : "oldest"))
          }
          className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="댓글 정렬 변경"
        >
          {sort === "oldest" ? "등록순" : "최신순"}
          <ArrowUpDown size={12} />
        </button>
      </div>
      <CommentForm mode="create" type="comment" />
      <CommentList sort={sort} boardAuthorId={boardAuthorId} />
    </div>
  );
};

export default CommentSection;
