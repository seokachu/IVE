"use client";
import ShareButton from "@/components/common/button/ShareButton";
import Link from "next/link";
import { useBoardDetail } from "@/hooks/queries/useBoard";
import type { BoardDetailContainerProps } from "@/types";
import BoardDetailUserInfo from "./BoardDetailUserInfo";
import CommentSection from "./CommentSection";
import BoardLikeButton from "./BoardLikeButton";
import BoardActionButton from "./BoardActionButton";
import BoardDetailHeader from "./BoardDetailHeader";
import BoardDetailContent from "./BoardDetailContent";
import CommentCount from "./CommentCount";

const BoardDetailContainer = ({ boardId }: BoardDetailContainerProps) => {
  const { data: board } = useBoardDetail(boardId);

  console.log(board);

  return (
    <>
      <div className="flex border-b py-5 items-center">
        <BoardDetailHeader />
        <div className="flex flex-col ml-auto justify-end">
          <div className="flex gap-3 text-sm items-center">
            <ShareButton />
            <Link href="/board" className="hover:text-purple">
              목록
            </Link>
          </div>
          <BoardActionButton />
        </div>
      </div>
      <BoardDetailContent />
      <BoardLikeButton />
      <BoardDetailUserInfo />
      <CommentCount />
      <CommentSection />
    </>
  );
};

export default BoardDetailContainer;
