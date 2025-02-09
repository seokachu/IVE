import CommentListItem from "@/components/board/comment/CommentListItem";
import { useCommentLists } from "@/hooks/queries/useComment";
import { useParams } from "next/navigation";

const CommentList = () => {
  const { id } = useParams();
  const { data: comments } = useCommentLists(Number(id));

  return (
    <ul className="text-sm">
      {comments?.map((item) => (
        <CommentListItem key={item.id} item={item} boardId={Number(id)} />
      ))}
    </ul>
  );
};

export default CommentList;
