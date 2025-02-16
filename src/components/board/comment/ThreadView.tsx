import { Form } from "@/components/ui/form";
import { cn } from "@/utils/utils";
import { Textarea } from "@/components/ui/textarea";
import ActionButton from "@/components/common/button/ActionButton";
import { UseFormReturn } from "react-hook-form";
import { BoardCommentType } from "@/hooks/user";

interface ThreadViewProps {
  form: UseFormReturn<BoardCommentType>;
  onSubmit: (e: React.FormEvent) => void;
  placeholder: string;
  submitButtonLabel: string;
}

const ThreadView = ({
  onSubmit,
  form,
  placeholder,
  submitButtonLabel,
}: ThreadViewProps) => {
  const {
    formState: { errors, isSubmitting },
  } = form;

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
            placeholder={placeholder}
            {...form.register("content")}
          />
          <ActionButton
            type="submit"
            variant="primary"
            className="rounded-sm text-sm py-4 px-5 shrink-0"
            disabled={isSubmitting}
          >
            {isSubmitting ? "처리 중..." : submitButtonLabel}
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

export default ThreadView;
