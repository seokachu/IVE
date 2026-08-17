import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/formatDate";
import type { PostListItemProps } from "@/types/mypage";

//내가 쓴 글 로우 — 제목 + 날짜·조회·댓글 메타 + 셰브런 (.pen "마이페이지 · 내가 쓴 글" 시안의 PostRow)
const PostListItem = ({ item, isLast = false }: PostListItemProps) => {
  const { push } = useRouter();

  const onClickBoardDetail = () => {
    push(`/board/${item.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      onClickBoardDetail();
    }
  };

  return (
    <li
      onClick={onClickBoardDetail}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className={`flex cursor-pointer items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-gray-50 ${
        isLast ? "" : "border-b border-gray-200"
      }`}
    >
      <div className="min-w-0">
        <p className="truncate text-[15px] font-semibold">{item.title}</p>
        <p className="mt-1.5 text-xs text-gray-400">
          <time>{formatDate(item.created_at, "dash")}</time>
          <span className="mx-1.5" aria-hidden="true">
            ·
          </span>
          조회 {item.views}
          <span className="mx-1.5" aria-hidden="true">
            ·
          </span>
          댓글 {item.board_comments[0]?.count || 0}
        </p>
      </div>
      <ChevronRight size={16} className="shrink-0 text-gray-400" aria-hidden="true" />
    </li>
  );
};

export default PostListItem;
