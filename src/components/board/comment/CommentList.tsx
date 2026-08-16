import CommentListItem from "@/components/board/comment/CommentListItem";
import { useCommentLists } from "@/hooks/queries/useComment";
import { useParams } from "next/navigation";
import { useState } from "react";
import type { CommentListProps } from "@/types/board";

const CommentList = ({ sort, boardAuthorId }: CommentListProps) => {
  const { id } = useParams();
  const { data: comments } = useCommentLists(Number(id));
  const [activeEditId, setActiveEditId] = useState<number | null>(null);

  //서버는 등록순(오름차순) 고정 — 최신순은 클라이언트에서 뒤집기
  const sortedComments =
    sort === "latest" ? [...(comments ?? [])].reverse() : comments;

  return (
    <ul className="text-sm divide-y divide-gray-200">
      {sortedComments?.map((item) => (
        <CommentListItem
          key={item.id}
          item={item}
          boardId={Number(id)}
          activeEditId={activeEditId}
          handleEditChange={setActiveEditId}
          boardAuthorId={boardAuthorId}
        />
      ))}
    </ul>
  );
};

export default CommentList;
