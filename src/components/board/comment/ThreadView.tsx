import { Form } from "@/components/ui/form";
import { cn } from "@/utils/utils";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/common/UserAvatar";
import { User } from "lucide-react";
import { useSession } from "@/store/zustand";
import type { ThreadViewProps } from "@/types/board";

const ThreadView = ({ onSubmit, form, placeholder, submitButtonLabel, onContentChange, showAvatar }: ThreadViewProps) => {
  const session = useSession();
  const {
    formState: { errors, isSubmitting },
  } = form;

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="w-full">
        <div className="flex items-start gap-2.5">
          {showAvatar &&
            (session ? (
              <UserAvatar size="sm" className="mt-1 shrink-0" />
            ) : (
              <span className="mt-1 shrink-0 w-[30px] h-[30px] rounded-full bg-purple-100 flex items-center justify-center">
                <User size={15} className="text-purple-500" />
              </span>
            ))}
          <div className="flex-1 min-w-0 rounded-xl border border-gray-300 bg-card px-4 py-3 focus-within:border-purple-300 transition-colors">
            <Textarea
              className={cn(
                "border-0 p-0 w-full rounded-none resize-none min-h-0 h-12 text-sm",
                "focus-visible:ring-0 focus-visible:ring-offset-0",
              )}
              placeholder={placeholder}
              {...form.register("content", {
                onChange: onContentChange,
              })}
            />
            <div className="flex justify-end mt-1.5">
              <Button
                type="submit"
                size="auto"
                className="rounded-full text-[13px] font-semibold px-4 py-1.5"
                disabled={isSubmitting}
              >
                {isSubmitting ? "처리 중..." : submitButtonLabel}
              </Button>
            </div>
          </div>
        </div>
        {errors.content && <span className="text-destructive text-xs px-3">{errors.content.message}</span>}
      </form>
    </Form>
  );
};

export default ThreadView;
