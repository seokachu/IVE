"use client";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
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
import { useAddBoard } from "@/hooks/queries/useBoard";
import { useRouter } from "next/navigation";
import { useRecoilValue } from "recoil";
import { sessionState } from "@/store";

const ReactQuill = dynamic(async () => await import("react-quill"), {
  ssr: false,
});

const BoardWriteForm = () => {
  const session = useRecoilValue(sessionState);
  const { push } = useRouter();
  const { mutate: addBoardList } = useAddBoard();

  const form = useForm<BoardWriteType>({
    mode: "onChange",
    resolver: zodResolver(boardWriteSchema),
    defaultValues: boardDefaultValues.boardWriteDefaultValues,
  });

  const {
    setValue,
    trigger,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = form;

  const onChangeContents = (value: string) => {
    setValue("contents", value === "<p><br></p>" ? "" : value);
    trigger("contents");
  };

  const onClickSubmit = async (data: BoardWriteType) => {
    try {
      await addBoardList({
        user_id: session?.user?.id,
        title: data.title,
        content: data.contents,
      });
      toast({
        title: "게시글 등록이 완료되었습니다.",
      });
      push("/board");
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "게시글 등록에 실패했습니다.",
          description:
            error instanceof Error
              ? error.message
              : "알 수 없는 오류가 발생했습니다.",
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
            />
          </div>
        </div>
        <div className="overflow-hidden">
          <ReactQuill
            onChange={onChangeContents}
            value={watch("contents")}
            className={errors.contents && "quill-error"}
          />
          {errors.contents && (
            <span className="text-destructive text-xs px-3">
              {errors.contents.message}
            </span>
          )}
        </div>
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="w-full py-2 mt-5"
        >
          {isSubmitting ? "등록 중..." : "등록하기"}
        </Button>
      </form>
    </Form>
  );
};

export default BoardWriteForm;
