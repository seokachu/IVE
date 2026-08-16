"use client";
import Link from "next/link";
import { ChevronDown, ChevronLeft, ChevronUp } from "lucide-react";
import {
  useAdjacentBoards,
  useBoardDetail,
  useDeleteBoard,
} from "@/hooks/queries/useBoard";
import BoardDetailUserInfo from "./BoardDetailUserInfo";
import BoardPrevNextNav from "./BoardPrevNextNav";
import CommentSection from "../comment/CommentSection";
import BoardLikeButton from "../BoardLikeButton";
import BoardDetailHeader from "./BoardDetailHeader";
import BoardDetailContent from "./BoardDetailContent";
import Error from "@/components/common/error/Error";
import BoardDetailSkeleton from "@/components/common/loading/BoardDetailSkeleton";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useEffect, useRef } from "react";
import type { AdjacentBoard, BoardDetailContainerProps } from "@/types/board";
import { useSession } from "@/store/zustand";

const AdjacentCircleButton = ({
  board,
  label,
  icon,
}: {
  board?: AdjacentBoard | null;
  label: string;
  icon: React.ReactNode;
}) => {
  const baseStyle =
    "w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500";

  if (!board) {
    return (
      <span className={`${baseStyle} opacity-40`} aria-hidden="true">
        {icon}
      </span>
    );
  }
  return (
    <Link
      href={`/board/${board.id}`}
      className={`${baseStyle} hover:bg-gray-50 transition-colors`}
      aria-label={label}
    >
      {icon}
    </Link>
  );
};

const BoardDetailContainer = ({ boardId }: BoardDetailContainerProps) => {
  const commentsRef = useRef<HTMLDivElement>(null);
  const { push } = useRouter();
  const session = useSession();
  const { data: board, isLoading, isError } = useBoardDetail(boardId);
  const { data: adjacent } = useAdjacentBoards(board?.created_at);
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
    <div className="max-w-[800px] m-auto flex flex-col gap-6 lg:gap-7 pt-6 lg:pt-8">
      <div className="flex items-center justify-between">
        <Link
          href="/board"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 text-[13px] font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft size={14} />
          목록으로
        </Link>
        <div className="flex items-center gap-2">
          <AdjacentCircleButton
            board={adjacent?.prev}
            label="이전 글"
            icon={<ChevronUp size={15} />}
          />
          <AdjacentCircleButton
            board={adjacent?.next}
            label="다음 글"
            icon={<ChevronDown size={15} />}
          />
        </div>
      </div>
      <BoardDetailHeader
        item={board}
        isAuthor={isAuthor}
        onClickDelete={onClickDelete}
        onClickEdit={onClickEdit}
      />
      <hr className="border-gray-200" />
      <BoardDetailContent item={board} />
      <BoardLikeButton item={board} />
      <BoardDetailUserInfo item={board} />
      <BoardPrevNextNav adjacent={adjacent} />
      <div ref={commentsRef} id="comments" data-testid="board-comments" className="pt-1">
        <CommentSection
          commentCount={board?.board_comments[0]?.count || 0}
          boardAuthorId={board?.user_id}
        />
      </div>
    </div>
  );
};

export default BoardDetailContainer;
