import ActionButton from "@/components/common/button/ActionButton";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/utils/utils";

const CommentForm = () => {
  return (
    <div className="flex items-center mb-5">
      <Textarea
        className={cn(
          "border-0 border-b w-full rounded-none py-4 resize-none h-14 min-h-0",
          "focus-visible:ring-0 focus-visible:ring-offset-0",
          "focus-visible:border-b-1 focus-visible:border-ring"
        )}
        placeholder="댓글을 입력해 주세요."
      />
      <ActionButton
        variant="primary"
        className="rounded-sm text-sm py-4 px-5 shrink-0"
      >
        등록
      </ActionButton>
    </div>
  );
};

export default CommentForm;
