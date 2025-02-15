"use client";
import ShareButton from "@/components/common/button/ShareButton";
import Link from "next/link";
import {
  useBoardDetail,
  useDeleteBoard,
  useUpdateBoard,
} from "@/hooks/queries/useBoard";
import BoardDetailUserInfo from "./BoardDetailUserInfo";
import CommentSection from "../comment/CommentSection";
import BoardLikeButton from "../BoardLikeButton";
import BoardActionButton from "../BoardActionButton";
import BoardDetailHeader from "./BoardDetailHeader";
import BoardDetailContent from "./BoardDetailContent";
import Error from "@/components/common/error/Error";
import { sessionState } from "@/store";
import { useRecoilValue } from "recoil";
import BoardDetailSkeleton from "@/components/common/loading/BoardDetailSkeleton";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import type { BoardDetailContainerProps } from "@/types";

const BoardDetailContainer = ({ boardId }: BoardDetailContainerProps) => {
  const { push } = useRouter();
  const session = useRecoilValue(sessionState);
  const { data: board, isLoading, isError } = useBoardDetail(boardId);
  const { mutate: deleteBoard } = useDeleteBoard(board?.id);
  const { mutate: editBoard } = useUpdateBoard();

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
  const onClickEdit = () => {};

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
              <BoardActionButton
                onEdit={onClickEdit}
                onDelete={onClickDelete}
              />
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
