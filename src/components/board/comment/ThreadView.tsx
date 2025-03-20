import { Form } from '@/components/ui/form';
import { cn } from '@/utils/utils';
import { Textarea } from '@/components/ui/textarea';
import ActionButton from '@/components/common/button/ActionButton';
import type { ThreadViewProps } from '@/types/board';

const ThreadView = ({ onSubmit, form, placeholder, submitButtonLabel, onContentChange }: ThreadViewProps) => {
  const {
    formState: { errors, isSubmitting },
  } = form;

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="mb-5">
        <div className="flex items-center">
          <Textarea
            className={cn(
              'border-0 border-b w-full rounded-none py-3 resize-none min-h-0 h-14',
              'focus-visible:ring-0 focus-visible:ring-offset-0',
              'focus-visible:border-b-1 focus-visible:border-ring'
            )}
            placeholder={placeholder}
            {...form.register('content', {
              onChange: onContentChange,
            })}
          />
          <ActionButton
            type="submit"
            variant="primary"
            className="rounded-sm text-sm py-4 px-5 shrink-0"
            disabled={isSubmitting}
          >
            {isSubmitting ? '처리 중...' : submitButtonLabel}
          </ActionButton>
        </div>
        {errors.content && <span className="text-destructive text-xs px-3">{errors.content.message}</span>}
      </form>
    </Form>
  );
};

export default ThreadView;
