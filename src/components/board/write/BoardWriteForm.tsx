"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { RHFInput } from "@/components/common/RHFInput";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  boardDefaultValues,
  boardWriteSchema,
  BoardWriteType,
} from "@/hooks/user";
import { Button } from "@/components/ui/button";
import "@/styles/quill.css";
import {
  useAddBoard,
  useBoardDetail,
  useUpdateBoard,
} from "@/hooks/queries/useBoard";
import { useRecoilValue } from "recoil";
import { sessionState } from "@/store";
import QuillEditor from "../editor/QuillEditor";
import type {
  BoardWriteFormProps,
  EditBoardWriteFormProps,
} from "@/types/board";

const BoardWriteForm = (props: BoardWriteFormProps) => {
  const session = useRecoilValue(sessionState);
  const { push } = useRouter();
  const { mutate: addBoardList } = useAddBoard();
  const { mutate: editBoard } = useUpdateBoard();

  const isEditMode = (
    props: BoardWriteFormProps
  ): props is EditBoardWriteFormProps => {
    return props.mode === "edit";
  };

  const { data: boardData } = useBoardDetail(
    props.mode === "edit" ? props.boardId : undefined
  );

  const form = useForm<BoardWriteType>({
    mode: "onChange",
    resolver: zodResolver(boardWriteSchema),
    defaultValues: boardDefaultValues.boardWriteDefaultValues,
  });

  const {
    setValue,
    trigger,
    watch,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = form;

  const contentValue = watch("content");

  useEffect(() => {
    if (isEditMode(props) && boardData) {
      reset({
        title: boardData.title,
        content: boardData.content,
      });
    }
  }, [boardData, props, reset]);

  const onChangeContent = (value: string) => {
    const newValue = value === "<p><br></p>" ? "" : value;
    if (newValue !== contentValue) {
      setValue("content", newValue);
      trigger("content");
    }
  };

  const onClickSubmit = async (data: BoardWriteType) => {
    try {
      if (props.mode === "edit" && boardData) {
        const isContentSame = data.content === boardData.content;
        const isTitleSame = data.title === boardData.title;

        if (isContentSame && isTitleSame) {
          toast({
            title: "수정된 내용이 없습니다.",
            description: "이전 내용으로 저장됩니다.",
          });
          push(`/board/${props.boardId}`);
          return;
        }
      }

      const sanitizedContent = data.content.trim();

      if (props.mode === "create") {
        await addBoardList({
          user_id: session?.user?.id,
          title: data.title,
          content: sanitizedContent,
        });
        toast({
          title: "게시글 등록이 완료되었습니다.",
        });
        push("/board");
      }

      if (props.mode === "edit") {
        editBoard({
          boardId: props.boardId,
          title: data.title,
          content: sanitizedContent,
        });
        toast({
          title: "게시글 수정이 완료되었습니다.",
        });
        push(`/board/${props.boardId}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "게시글 등록에 실패했습니다.",
          description: error.message ?? "알 수 없는 오류가 발생했습니다.",
          variant: "destructive",
        });
        throw error.message;
      }
    }
  };

  return (
    <Form {...form}>
      <form className="w-full" onSubmit={form.handleSubmit(onClickSubmit)}>
        <div className="mb-5 flex items-center w-full">
          <div className="flex-1">
            <RHFInput
              type="text"
              name="title"
              messageClassName="text-xs py-1 px-3"
              placeholder="제목을 입력해 주세요."
              className="py-1 rounded-sm w-full"
              maxLength={100}
            />
          </div>
        </div>
        <QuillEditor
          value={contentValue}
          onChange={onChangeContent}
          error={errors.content?.message}
        />
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="w-full py-2 mt-5"
        >
          {isSubmitting
            ? "등록 중..."
            : props.mode === "create"
            ? "등록하기"
            : "수정하기"}
        </Button>
      </form>
    </Form>
  );
};

export default BoardWriteForm;
