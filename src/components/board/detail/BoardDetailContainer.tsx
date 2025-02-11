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
import Error from "@/components/common/error/Error";
import { sessionState } from "@/store";
import { useRecoilValue } from "recoil";

const BoardDetailContainer = ({ boardId }: BoardDetailContainerProps) => {
  const session = useRecoilValue(sessionState);
  const { data: board, isLoading, isError } = useBoardDetail(boardId);

  //스켈레톤 추가해야함
  if (isLoading) return <div>로딩중......</div>;
  if (isError) return <Error />;

  const isAuthor = session?.user?.id === board?.user_id;

  return (
    <>
      <div className="flex border-b py-5 items-center">
        <BoardDetailHeader item={board} />
        <div className="flex flex-col ml-auto justify-end shrink-0">
          <div className="flex gap-3 text-sm items-center">
            <ShareButton />
            <Link href="/board" className="hover:text-purple">
              목록
            </Link>
          </div>
          {isAuthor && (
            <div className="flex justify-end items-center gap-1 text-sm pt-3">
              <BoardActionButton />
            </div>
          )}
        </div>
      </div>
      <BoardDetailContent item={board} />
      <BoardLikeButton item={board} />
      <BoardDetailUserInfo item={board} />
      <div className="flex gap-4 mt-5 border-t pt-5 pb-5">
        <p className="font-bold">
          댓글 {board?.board_comments[0]?.count || 0}개
        </p>
      </div>
      <CommentSection />
    </>
  );
};

export default BoardDetailContainer;
