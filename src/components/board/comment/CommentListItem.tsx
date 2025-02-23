import DefaultImage from "@/assets/images/default_image.avif";
import Image from "next/image";
import { AiOutlineLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";
import ActionButton from "@/components/common/button/ActionButton";
import {
  useDeleteComment,
  useRepliesCommentList,
} from "@/hooks/queries/useComment";
import { formatDate } from "@/utils/formatDate";
import BoardActionButton from "../BoardActionButton";
import { useRecoilValue } from "recoil";
import { sessionState } from "@/store";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import CommentForm from "./CommentForm";
import { PiArrowBendDownRightBold } from "react-icons/pi";
import useAuthGuard from "@/hooks/useAuthGuard";
import {
  useCommentLikeStatus,
  useToggleCommentLike,
} from "@/hooks/queries/useLike";
import type { CommentListItemProps } from "@/types";

const CommentListItem = ({
  item,
  boardId,
  activeEditId,
  handleEditChange,
}: CommentListItemProps) => {
  const { push } = useRouter();
  const session = useRecoilValue(sessionState);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const { checkAuth } = useAuthGuard();
  const { mutate: deleteComment } = useDeleteComment(
    boardId,
    item.id,
    item.parent_id
  );
  const { data: replies } = useRepliesCommentList(item.id);
  const { data: isCommentLiked } = useCommentLikeStatus(
    item.id,
    session?.user?.id
  );
  const { mutate: toggleCommentLike, isPending } = useToggleCommentLike(
    item.id,
    session?.user?.id
  );

  const isAuthor = session?.user?.id === item?.user_id;
  const isEditing = activeEditId === item.id;

  console.log(item);

  const onClickDelete = () => {
    deleteComment();
    push(`/board/${boardId}`);
    toast({
      title: "댓글이 삭제 되었습니다.",
    });
  };

  const onClickEdit = () => {
    if (!isEditing) {
      handleEditChange(item.id);
    } else {
      handleEditChange(null);
      setShowReplyForm(false);
    }
  };

  const onClickReplies = () => {
    if (!checkAuth()) return;
    setShowReplyForm((prev) => !prev);
  };

  const handleCommentLikeToggle = () => {
    if (!checkAuth()) return;
    toggleCommentLike(undefined, {
      onSuccess: (newStatus) => {
        toast({
          title: newStatus
            ? "좋아요를 눌렀습니다."
            : "좋아요가 취소되었습니다.",
        });
      },
    });
  };

  return (
    <li className="py-2">
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
                onSuccess={() => handleEditChange(null)}
              />
            </div>
          ) : (
            <>
              <p className="text-sm py-2 whitespace-pre-wrap">
                {item?.content}
              </p>
              <div>
                <div className="flex items-center gap-4">
                  {!item.parent_id && (
                    <>
                      <ActionButton
                        onClick={handleCommentLikeToggle}
                        disabled={isPending}
                        variant="default"
                        className={`border-none flex items-center gap-[2px] hover:text-purple ${
                          isCommentLiked ? "text-purple" : ""
                        }`}
                      >
                        {!isCommentLiked ? (
                          <AiOutlineLike size={15} />
                        ) : (
                          <AiFillLike size={15} />
                        )}
                        <span>{item?.likes[0]?.count || 0}</span>
                      </ActionButton>
                      <ActionButton
                        onClick={onClickReplies}
                        variant="default"
                        className="border-none"
                      >
                        {!showReplyForm ? "답변" : "닫기"}
                      </ActionButton>
                    </>
                  )}
                </div>
                <div className="mt-2">
                  {showReplyForm && (
                    <CommentForm
                      mode="create"
                      type="reply"
                      parentId={item.id}
                      onSuccess={() => setShowReplyForm(false)}
                    />
                  )}
                </div>
                {replies && replies.length > 0 && (
                  <div className="flex gap-2">
                    <PiArrowBendDownRightBold
                      size={20}
                      className="translate-y-3"
                    />
                    <ul className="flex flex-col w-full">
                      {replies.map((reply) => (
                        <CommentListItem
                          key={reply.id}
                          item={reply}
                          boardId={boardId}
                          activeEditId={activeEditId}
                          handleEditChange={handleEditChange}
                        />
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </li>
  );
};

export default CommentListItem;
