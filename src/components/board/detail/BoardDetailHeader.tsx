import { useState } from "react";
import { MoreHorizontal, PencilLine, Trash2 } from "lucide-react";
import { formatRelativeTime } from "@/utils/formatDate";
import ShareButton from "@/components/common/button/ShareButton";
import UserAvatar from "@/components/common/UserAvatar";
import ConfirmModal from "@/components/common/modal/ConfirmModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { BoardDetailHeaderProps } from "@/types/board";

const BoardDetailHeader = ({
  item,
  isAuthor,
  onClickDelete,
  onClickEdit,
}: BoardDetailHeaderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full flex flex-col gap-4">
      <h2 className="text-2xl lg:text-[28px] lg:leading-snug font-bold break-all">
        {item?.title}
      </h2>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <UserAvatar
            size="md"
            userId={item.user_id}
            userName={item.user?.name}
            avatarUrl={item.user?.avatar_url}
          />
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-sm font-semibold truncate">
              {item?.user?.name}
            </span>
            <span className="text-xs text-gray-400">
              {formatRelativeTime(item?.created_at)} · 조회 {item?.views || 0}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <ShareButton
            className="w-9 h-9 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50"
            iconSize={15}
          />
          {isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                aria-label="게시글 관리 메뉴"
              >
                <MoreHorizontal className="w-[15px] h-[15px]" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="min-w-[180px] rounded-[14px] border-gray-200 shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-1.5"
              >
                <DropdownMenuItem
                  onClick={onClickEdit}
                  className="gap-2.5 rounded-lg px-3 py-2.5 text-sm"
                >
                  <PencilLine size={15} className="text-gray-500" />
                  수정하기
                </DropdownMenuItem>
                <DropdownMenuSeparator className="mx-2 bg-gray-200" />
                <DropdownMenuItem
                  onClick={() => setIsModalOpen(true)}
                  className="gap-2.5 rounded-lg px-3 py-2.5 text-sm text-[#E72424] focus:text-[#E72424]"
                >
                  <Trash2 size={15} />
                  삭제하기
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      {isModalOpen && (
        <ConfirmModal
          isOpen={setIsModalOpen}
          onConfirm={onClickDelete}
          title="게시글을 삭제할까요?"
          description="삭제한 글은 되돌릴 수 없고, 달린 댓글도 함께 사라져요."
          cancelText="취소"
          confirmText="삭제하기"
          variant="destructive"
        />
      )}
    </div>
  );
};

export default BoardDetailHeader;
