import CommentListItem from "@/components/board/comment/CommentListItem";
import { useCommentLists } from "@/hooks/queries/useComment";
import { useParams } from "next/navigation";
import { useState } from "react";

const CommentList = () => {
  const { id } = useParams();
  const { data: comments } = useCommentLists(Number(id));
  const [activeEditId, setActiveEditId] = useState<number | null>(null);

  return (
    <ul className="text-sm">
      {comments?.map((item) => (
        <CommentListItem
          key={item.id}
          item={item}
          boardId={Number(id)}
          activeEditId={activeEditId}
          handleEditChange={setActiveEditId}
        />
      ))}
    </ul>
  );
};

export default CommentList;
