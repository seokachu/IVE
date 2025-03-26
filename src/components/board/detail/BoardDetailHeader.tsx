import Link from "next/link";
import { formatDate } from "@/utils/formatDate";
import BoardActionButton from "../BoardActionButton";
import ShareButton from "@/components/common/button/ShareButton";
import type { BoardDetailHeaderProps } from "@/types/board";

const BoardDetailHeader = ({ item, isAuthor, onClickDelete, onClickEdit }: BoardDetailHeaderProps) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-start">
        <h2 className="text-base lg:text-lg font-bold break-all mr-5 mb-1">{item?.title}</h2>
        <div className="flex flex-col justify-end shrink-0 mt-1">
          <div className="flex gap-3 text-sm items-center">
            <ShareButton />
            <Link href="/board" className="hover:text-purple">
              목록
            </Link>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <div>
          <time className="text-gray-500 text-xs lg:text-sm">{formatDate(item?.created_at)}</time>
          <span className="ml-2 text-xs lg:text-sm text-gray-500">조회 {item?.views || 0}</span>
          <span className="ml-2 text-xs lg:text-sm text-gray-500">추천 {item?.board_likes[0]?.count || 0}</span>
        </div>
        {isAuthor && (
          <div className="flex justify-end items-center gap-1 text-sm">
            <BoardActionButton onEdit={onClickEdit} onDelete={onClickDelete} mode="default" />
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardDetailHeader;
