"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  boardDefaultValues,
  boardWriteSchema,
  BoardWriteType,
} from "@/hooks/user";
import {
  useAddBoard,
  useBoardDetail,
  useUpdateBoard,
} from "@/hooks/queries/useBoard";
import TiptapEditor from "../editor/TiptapEditor";
import type {
  BoardWriteFormProps,
  EditBoardWriteFormProps,
} from "@/types/board";
import { useSession } from "@/store/zustand";

const WRITE_GUIDES = [
  "서로를 존중하는 표현을 사용해 주세요.",
  "공연·이벤트 후기에는 스포일러 표기를 잊지 마세요.",
  "광고·홍보성 게시글은 예고 없이 삭제될 수 있어요.",
];

const BoardWriteForm = (props: BoardWriteFormProps) => {
  const session = useSession();
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

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<BoardWriteType>({
    mode: "onChange",
    resolver: zodResolver(boardWriteSchema),
    defaultValues: boardDefaultValues.boardWriteDefaultValues,
  });

  const titleValue = watch("title");
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
    if (value !== contentValue) {
      setValue("content", value);
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

  const cancelHref = props.mode === "edit" ? `/board/${props.boardId}` : "/board";

  return (
    <form
      className="w-full flex flex-col gap-7"
      onSubmit={handleSubmit(onClickSubmit)}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="board-title" className="text-sm font-semibold">
              제목
            </label>
            <span className="text-xs text-gray-400 tabular-nums">
              {titleValue?.length ?? 0}/100
            </span>
          </div>
          <input
            id="board-title"
            type="text"
            maxLength={100}
            placeholder="제목을 입력해 주세요"
            className={`w-full h-[52px] px-[18px] rounded-xl border bg-white dark:bg-[#1E1E21] text-[15px] placeholder:text-gray-400 outline-none transition-colors ${
              errors.title
                ? "border-destructive"
                : "border-gray-300 focus:border-purple-300"
            }`}
            {...register("title")}
          />
          {errors.title && (
            <span className="text-destructive text-xs px-3">
              {errors.title.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold">내용</span>
          <TiptapEditor
            value={contentValue}
            onChange={onChangeContent}
            error={errors.content?.message}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2.5 rounded-2xl bg-purple-50 px-5 py-[18px]">
        <div className="flex items-center gap-2">
          <Sparkles size={15} className="text-purple-400" />
          <strong className="text-sm font-semibold">
            글쓰기 전에 잠깐 확인해 주세요
          </strong>
        </div>
        <ul className="flex flex-col gap-1.5">
          {WRITE_GUIDES.map((guide) => (
            <li key={guide} className="flex items-center gap-2 text-[13px] text-gray-500">
              <span
                className="w-[3px] h-[3px] rounded-full bg-purple-400 shrink-0"
                aria-hidden="true"
              />
              {guide}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-xs text-gray-400">
          {props.mode === "create"
            ? "등록하면 자유게시판에 바로 공개돼요"
            : "수정한 내용은 저장 즉시 반영돼요"}
        </p>
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <Link
            href={cancelHref}
            className="px-7 py-3 rounded-full border border-gray-300 text-[15px] font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="flex items-center gap-2 px-8 py-3 rounded-full text-[15px] font-bold text-white bg-gradient-to-b from-purple-400 to-purple-300 shadow-[0_4px_14px_rgba(219,151,233,0.35)] hover:from-purple-500 hover:to-purple-400 disabled:opacity-40 disabled:pointer-events-none transition-all"
          >
            <Send size={16} />
            {isSubmitting
              ? "등록 중..."
              : props.mode === "create"
              ? "등록하기"
              : "수정하기"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default BoardWriteForm;
