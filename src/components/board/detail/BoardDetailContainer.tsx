"use client";
import ShareButton from "@/components/common/button/ShareButton";
import Link from "next/link";
import { useBoardDetail } from "@/hooks/queries/useBoard";
import BoardDetailUserInfo from "./BoardDetailUserInfo";
import CommentSection from "../comment/CommentSection";
import BoardLikeButton from "../BoardLikeButton";
import BoardActionButton from "../BoardActionButton";
import BoardDetailHeader from "./BoardDetailHeader";
import BoardDetailContent from "./BoardDetailContent";
import type { BoardDetailContainerProps } from "@/types";

const BoardDetailContainer = ({ boardId }: BoardDetailContainerProps) => {
  const { data: board } = useBoardDetail(boardId);

  return (
    <>
      <div className="flex border-b py-5 items-center">
        <BoardDetailHeader item={board} />
        <div className="flex flex-col ml-auto justify-end">
          <div className="flex gap-3 text-sm items-center">
            <ShareButton />
            <Link href="/board" className="hover:text-purple">
              목록
            </Link>
          </div>
          {/* 로그인 한 유저중 자신이 글 쓴 사람만 버튼 보이게 */}
          <div className="flex justify-end items-center gap-1 text-sm pt-3">
            <BoardActionButton />
          </div>
        </div>
      </div>
      <BoardDetailContent item={board} />
      <BoardLikeButton />
      <BoardDetailUserInfo item={board} />
      <div className="flex gap-4 mt-5 border-t pt-5 pb-5">
        <p className="font-bold">댓글 {board?.board_comments.count || 0}개</p>
      </div>
      <CommentSection />
    </>
  );
};

export default BoardDetailContainer;
