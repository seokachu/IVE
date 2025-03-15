"use client";
import { useBoardDetail, useDeleteBoard } from "@/hooks/queries/useBoard";
import BoardDetailUserInfo from "./BoardDetailUserInfo";
import CommentSection from "../comment/CommentSection";
import BoardLikeButton from "../BoardLikeButton";
import BoardDetailHeader from "./BoardDetailHeader";
import BoardDetailContent from "./BoardDetailContent";
import Error from "@/components/common/error/Error";
import { sessionState } from "@/store";
import { useRecoilValue } from "recoil";
import BoardDetailSkeleton from "@/components/common/loading/BoardDetailSkeleton";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useEffect, useRef } from "react";
import type { BoardDetailContainerProps } from "@/types";

const BoardDetailContainer = ({ boardId }: BoardDetailContainerProps) => {
  const commentsRef = useRef<HTMLDivElement>(null);
  const { push } = useRouter();
  const session = useRecoilValue(sessionState);
  const { data: board, isLoading, isError } = useBoardDetail(boardId);
  const { mutate: deleteBoard } = useDeleteBoard(board?.id);

  useEffect(() => {
    if (window.location.hash === "#comments") {
      setTimeout(() => {
        commentsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [board]);

  if (isLoading) return <BoardDetailSkeleton />;
  if (isError) return <Error />;

  const isAuthor = session?.user?.id === board?.user_id;

  //삭제 Btn
  const onClickDelete = () => {
    deleteBoard();
    push("/board");
    toast({
      title: "게시글이 삭제 되었습니다.",
    });
  };

  //수정 Btn
  const onClickEdit = () => {
    push(`/board/edit/${board.id}`);
  };

  return (
    <>
      <div className="flex border-b py-5 items-start justify-between">
        <BoardDetailHeader
          item={board}
          isAuthor={isAuthor}
          onClickDelete={onClickDelete}
          onClickEdit={onClickEdit}
        />
      </div>
      <BoardDetailContent item={board} />
      <BoardLikeButton item={board} />
      <BoardDetailUserInfo item={board} />
      <div
        ref={commentsRef}
        className="flex gap-4 mt-5 border-t pt-5 pb-5"
        id="comments"
      >
        <p className="font-bold">
          댓글 {board?.board_comments[0]?.count || 0}개
        </p>
      </div>
      <CommentSection />
    </>
  );
};

export default BoardDetailContainer;
