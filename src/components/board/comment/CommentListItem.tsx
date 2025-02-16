import DefaultImage from "@/assets/images/default_image.avif";
import Image from "next/image";
import { AiOutlineLike } from "react-icons/ai";
import ActionButton from "@/components/common/button/ActionButton";
import { useDeleteComment } from "@/hooks/queries/useComment";
import { formatDate } from "@/utils/formatDate";
import BoardActionButton from "../BoardActionButton";
import { useRecoilValue } from "recoil";
import { sessionState } from "@/store";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import CommentForm from "./CommentForm";
import type { CommentListItemProps } from "@/types";

const CommentListItem = ({ item, boardId }: CommentListItemProps) => {
  const { push } = useRouter();
  const session = useRecoilValue(sessionState);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: deleteComment } = useDeleteComment(boardId, item.id);

  const isAuthor = session?.user?.id === item?.user_id;

  const onClickDelete = () => {
    deleteComment();
    push(`/board/${boardId}`);
    toast({
      title: "댓글이 삭제 되었습니다.",
    });
  };

  const onClickEdit = () => {
    if (!isEditing) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
      setShowReplyForm(false);
    }
  };

  const onClickReplies = () => {
    setShowReplyForm((prev) => !prev);
  };

  return (
    <li className="py-3">
      <div className="flex gap-2 items-start">
        <h3 className="relative w-[40px] h-auto overflow-hidden rounded-full border shrink-0">
          <Image
            src={item?.user?.avatar_url || DefaultImage}
            alt={item?.user?.name}
            className="fill"
            width={500}
            height={500}
          />
        </h3>
        <div className="w-full">
          <div className="flex justify-between">
            <div className="flex gap-2">
              <h2>{item?.user?.name}</h2>
              <time className="text-dark-gray">
                {formatDate(item?.created_at)}
              </time>
            </div>
            {isAuthor && (
              <BoardActionButton
                onDelete={onClickDelete}
                onEdit={onClickEdit}
                mode={isEditing ? "edit" : "default"}
              />
            )}
          </div>
          {isEditing ? (
            <div className="my-3">
              <CommentForm
                mode="edit"
                type="comment"
                initialContent={item.content}
                commentId={item.id}
                onSuccess={() => setIsEditing(false)}
              />
            </div>
          ) : (
            <>
              <p className="text-sm py-2 whitespace-pre-wrap">
                {item?.content}
              </p>
              <div>
                <div className="flex items-center gap-4">
                  <ActionButton
                    variant="default"
                    className="border-none flex items-center gap-1 hover:text-purple"
                  >
                    <AiOutlineLike size={15} />
                    <span>0</span>
                  </ActionButton>
                  <ActionButton
                    onClick={onClickReplies}
                    variant="default"
                    className="border-none"
                  >
                    {!showReplyForm ? "답변" : "닫기"}
                  </ActionButton>
                </div>
                <div className="mt-2">
                  {showReplyForm && (
                    <CommentForm
                      mode="create"
                      type="reply"
                      parentId={boardId}
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </li>
  );
};

export default CommentListItem;
