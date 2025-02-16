import ActionButton from "@/components/common/button/ActionButton";
import { Textarea } from "@/components/ui/textarea";
import { useAddComment } from "@/hooks/queries/useComment";
import { toast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import useAuthGuard from "@/hooks/useAuthGuard";
import {
  boardCommentSchema,
  BoardCommentType,
  boardDefaultValues,
} from "@/hooks/user";
import { sessionState } from "@/store";
import { cn } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import React from "react";

type CommentFormMode = "create" | "edit";
interface CommentFormProps {
  mode: CommentFormMode;
}

const CommentForm = ({ mode = "create" }: CommentFormProps) => {
  const { id } = useParams();
  const session = useRecoilValue(sessionState);
  const { checkAuth } = useAuthGuard();
  const { mutate: addComment } = useAddComment(Number(id));

  const form = useForm<BoardCommentType>({
    mode: "onSubmit",
    resolver: zodResolver(boardCommentSchema),
    defaultValues: boardDefaultValues.boardCommentDefaultValues,
  });

  const {
    reset,
    trigger,
    getValues,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!checkAuth()) return;

    const content = getValues("content");
    const isValid = await trigger();

    if (!isValid) return;

    try {
      await addComment({
        board_id: Number(id),
        user_id: session?.user.id,
        content,
      });
      toast({
        title: "댓글 작성에 성공했습니다.",
      });
      reset();
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "댓글 작성 실패",
          description:
            error instanceof Error
              ? error.message
              : "알 수 없는 오류가 발생했습니다.",
          variant: "destructive",
        });
      }
      throw error;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="mb-5">
        <div className="flex items-center">
          <Textarea
            className={cn(
              "border-0 border-b w-full rounded-none py-4 resize-none h-14 min-h-0",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              "focus-visible:border-b-1 focus-visible:border-ring"
            )}
            placeholder="댓글을 입력해 주세요."
            {...form.register("content")}
          />
          <ActionButton
            type="submit"
            variant="primary"
            className="rounded-sm text-sm py-4 px-5 shrink-0"
            disabled={isSubmitting}
          >
            {isSubmitting ? "등록 중..." : "등록"}
          </ActionButton>
        </div>
        {errors.content && (
          <span className="text-destructive text-xs px-3">
            {errors.content.message}
          </span>
        )}
      </form>
    </Form>
  );
};

export default CommentForm;
