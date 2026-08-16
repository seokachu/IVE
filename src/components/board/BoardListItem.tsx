import { useRouter } from "next/navigation";
import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";
import { formatRelativeTime, isWithinHours } from "@/utils/formatDate";
import { useIncrementViewCount } from "@/hooks/queries/useBoard";
import { hasViewedPost, markPostAsViewed } from "@/utils/viewCount";
import UserAvatar from "@/components/common/UserAvatar";
import {
  BOARD_HOT_LIKE_THRESHOLD,
  BOARD_NEW_POST_HOURS,
} from "@/utils/constants";
import type { BoardListItemProps } from "@/types/board";

const BoardListItem = ({ item, keyword }: BoardListItemProps) => {
  const { push } = useRouter();

  const incrementViewCount = useIncrementViewCount();

  const countView = () => {
    if (!hasViewedPost(item.id)) {
      incrementViewCount.mutate(item.id);
      markPostAsViewed(item.id);
    }
  };

  const onClickBoardDetail = () => {
    countView();
    push(`/board/${item.id}`);
  };

  const onClickCommentDetail = (e: React.MouseEvent) => {
    e.stopPropagation();
    countView();
    push(`/board/${item.id}#comments`);
  };

  //검색어 하이라이트 처리
  const highlightKeyword = (title: string | null, keyword: string) => {
    if (!title || !keyword || keyword === "") return title;

    const escapeRegExp = (text: string) => {
      return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    };

    const regex = new RegExp(`(${escapeRegExp(keyword)})`, "gi");
    const word = title.split(regex);

    return word.map((text, index) => {
      if (text.toLowerCase() === keyword.toLowerCase()) {
        return (
          <span key={index} className="bg-purple-100">
            {text}
          </span>
        );
      }
      return text;
    });
  };

  const isNew = isWithinHours(item.created_at, BOARD_NEW_POST_HOURS);
  const isHotLike = (item.like_count ?? 0) >= BOARD_HOT_LIKE_THRESHOLD;

  return (
    <li
      onClick={onClickBoardDetail}
      className="cursor-pointer hover:bg-gray-50 transition-colors"
      data-testid="board-item"
      data-detail-path={`/board/${item.id}`}
    >
      <div className="flex items-center gap-3 lg:gap-4 px-2 py-3.5 lg:py-4">
        {item.thumbnail && (
          <div className="relative w-12 h-12 lg:w-14 lg:h-14 shrink-0 rounded-lg overflow-hidden bg-white border border-gray-200">
            <Image src={item.thumbnail} alt="" fill className="object-cover" sizes="56px" />
          </div>
        )}
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="truncate text-[15px] font-semibold">
              {highlightKeyword(item.title, keyword || "")}
            </h3>
            {(item.comment_count ?? 0) > 0 && (
              <button
                type="button"
                onClick={onClickCommentDetail}
                aria-label={`댓글 ${item.comment_count}개 보기`}
                className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 text-[11px] font-bold text-purple-500 dark:text-purple-300 hover:bg-purple-100 transition-colors"
              >
                <MessageCircle className="w-3 h-3" aria-hidden="true" />
                {item.comment_count}
              </button>
            )}
            {isNew && (
              <span
                className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"
                aria-label="새 글"
              />
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 min-w-0">
            {/* 아바타 없으면 UserAvatar가 이니셜 파스텔 서클로 폴백 — 항상 렌더 */}
            <UserAvatar
              size="xs"
              userId={item.user_id}
              userName={item.name}
              avatarUrl={item.avatar_url}
              className="!w-5 !h-5 shrink-0"
            />
            <span className="text-gray-500 font-medium shrink-0">{item.name}</span>
            <span className="truncate">
              · {formatRelativeTime(item.created_at)} · 조회 {item.views ?? 0}
            </span>
          </div>
        </div>
        <span
          className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
            isHotLike
              ? "bg-orange-100 text-orange-500"
              : "border border-gray-200 text-gray-500"
          }`}
          aria-label={`추천 ${item.like_count ?? 0}개`}
        >
          <Heart
            className={`w-3.5 h-3.5 ${isHotLike ? "fill-current" : ""}`}
            aria-hidden="true"
          />
          {item.like_count ?? 0}
        </span>
      </div>
    </li>
  );
};

export default BoardListItem;
