import UserAvatar from "@/components/common/UserAvatar";
import { CornerDownRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteComment, useRepliesCommentList } from "@/hooks/queries/useComment";
import { formatRelativeTime } from "@/utils/formatDate";
import EditDeleteActions from "@/components/common/EditDeleteActions";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import CommentForm from "./CommentForm";
import useAuthGuard from "@/hooks/useAuthGuard";
import { useCommentLikeStatus, useToggleCommentLike } from "@/hooks/queries/useLike";
import { useMembershipTier } from "@/hooks/queries/useMembership";
import MembershipBadge from "@/components/mypage/MembershipBadge";
import type { CommentListItemProps } from "@/types/board";
import { useSession } from "@/store/zustand";

const CommentListItem = ({ item, boardId, activeEditId, handleEditChange, boardAuthorId }: CommentListItemProps) => {
  const session = useSession();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const { checkAuth } = useAuthGuard();
  const { mutate: deleteComment } = useDeleteComment(boardId, item.id, item.parent_id);
  const { data: replies } = useRepliesCommentList(item.id);
  const { data: isCommentLiked } = useCommentLikeStatus(item.id, session?.user?.id);
  const { mutate: toggleCommentLike, isPending } = useToggleCommentLike(item.id, session?.user?.id);

  const membershipTier = useMembershipTier(item?.user_id);

  const isAuthor = session?.user?.id === item?.user_id;
  const isBoardAuthor = !!item.user_id && item.user_id === boardAuthorId;
  const isEditing = activeEditId === item.id;
  const isReply = !!item.parent_id;

  const onClickDelete = () => {
    deleteComment();
    toast({
      title: "댓글이 삭제 되었습니다.",
    });
  };

  const onClickEdit = () => {
    handleEditChange(item.id);
    setShowReplyForm(false);
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
          title: newStatus ? "좋아요를 눌렀습니다." : "좋아요가 취소되었습니다.",
        });
      },
    });
  };

  return (
    <li className={isReply ? "bg-gray-50 rounded-lg px-3.5 py-3" : "py-4"}>
      <div className="flex gap-2.5 items-start">
        {/* 아바타 없으면 UserAvatar가 이니셜 파스텔 서클로 폴백 — 게시판 목록과 동일 규칙 */}
        <UserAvatar
          userId={item?.user_id}
          avatarUrl={item?.user?.avatar_url}
          userName={item?.user?.name}
          size={isReply ? "sm" : "md"}
          className={`shrink-0 ${isReply ? "" : "w-9 h-9"} ${
            membershipTier !== "free" ? "ring-[1.5px] ring-purple-300" : ""
          }`}
        />
        <div className="w-full min-w-0">
          <div className="flex justify-between items-center gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <h2 className="text-sm font-semibold truncate">{item?.user?.name}</h2>
              <MembershipBadge tier={membershipTier} size="sm" />
              {/* 시안(OpChip)은 다크에서도 라이트 색 고정 — 테마 따라 뒤집히는 purple 토큰 대신 리터럴 사용 */}
              {isBoardAuthor && (
                <span className="shrink-0 px-[7px] py-0.5 rounded-full bg-[#F5E3F8] text-[10px] font-bold text-[#A94FC0]">
                  작성자
                </span>
              )}
              <time className="shrink-0 text-xs text-gray-400">{formatRelativeTime(item?.created_at)}</time>
            </div>
          </div>
          {isEditing ? (
            <div className="my-3">
              <CommentForm
                mode="edit"
                type={item.parent_id ? "reply" : "comment"}
                initialContent={item.content}
                commentId={item.id}
                onSuccess={() => handleEditChange(null)}
                onCancel={() => handleEditChange(null)}
              />
            </div>
          ) : (
            <>
              <p className="text-sm py-1.5 whitespace-pre-wrap leading-relaxed">{item?.content}</p>
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3.5">
                    <Button
                      onClick={handleCommentLikeToggle}
                      disabled={isPending}
                      variant="plain" size="auto"
                      className={`flex items-center gap-1 font-semibold hover:text-purple ${
                        isReply ? "text-[11px]" : "text-xs"
                      } ${isCommentLiked ? "text-purple" : "text-gray-400"}`}
                    >
                      <Heart size={isReply ? 12 : 13} fill={isCommentLiked ? "currentColor" : "none"} />
                      <span>{item?.likes[0]?.count || 0}</span>
                    </Button>
                    {!item.parent_id && (
                      <Button
                        onClick={onClickReplies}
                        variant="plain" size="auto"
                        className="text-xs font-semibold text-gray-400 hover:text-gray-600"
                      >
                        {!showReplyForm ? "답글 쓰기" : "닫기"}
                      </Button>
                    )}
                  </div>
                  {isAuthor && (
                    <EditDeleteActions
                      size="sm"
                      onEdit={onClickEdit}
                      onDelete={onClickDelete}
                      confirmTitle="댓글을 삭제할까요?"
                      confirmDescription="삭제한 댓글은 되돌릴 수 없어요."
                    />
                  )}
                </div>
                {showReplyForm && (
                  <div className="mt-3">
                    <CommentForm
                      mode="create"
                      type="reply"
                      parentId={item.id}
                      onSuccess={() => setShowReplyForm(false)}
                    />
                  </div>
                )}
                {replies && replies.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    <CornerDownRight size={16} className="text-purple-300 shrink-0 mt-3" />
                    <ul className="flex flex-col gap-2 w-full">
                      {replies.map((reply) => (
                        <CommentListItem
                          key={reply.id}
                          item={reply}
                          boardId={boardId}
                          activeEditId={activeEditId}
                          handleEditChange={handleEditChange}
                          boardAuthorId={boardAuthorId}
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
