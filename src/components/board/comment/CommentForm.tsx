import { useAddComment, useEditComment } from '@/hooks/queries/useComment';
import { toast } from '@/hooks/use-toast';
import useAuthGuard from '@/hooks/useAuthGuard';
import { boardCommentSchema, BoardCommentType, boardDefaultValues } from '@/hooks/user';
import { sessionState } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useRecoilValue } from 'recoil';
import ThreadView from './ThreadView';
import type { CommentFormProps } from '@/types/board';

const CommentForm = ({ mode, type, initialContent, commentId, onSuccess, parentId }: CommentFormProps) => {
  const { id: boardId } = useParams();
  const session = useRecoilValue(sessionState);
  const { checkAuth } = useAuthGuard();
  const { mutate: addComment } = useAddComment(Number(boardId));
  const { mutate: editComment } = useEditComment(Number(boardId));

  const form = useForm<BoardCommentType>({
    mode: 'onSubmit',
    resolver: zodResolver(boardCommentSchema),
    defaultValues: {
      ...boardDefaultValues.boardCommentDefaultValues,
      content: initialContent ?? undefined,
    },
  });

  const { reset, trigger, getValues, clearErrors } = form;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!checkAuth()) return;

    const content = getValues('content');

    if (!content?.trim()) {
      const isValid = await trigger();
      if (!isValid) return;
    }

    try {
      if (mode === 'edit' && commentId) {
        //내용이 이전과 동일한지 체크
        if (content === initialContent) {
          toast({
            title: '수정된 내용이 없습니다.',
            description: '이전 내용으로 저장됩니다.',
          });
          onSuccess?.();
          return;
        }

        await editComment({
          commentId: commentId,
          content,
        });
        reset();
        onSuccess?.();
      }

      if (mode === 'create') {
        await addComment({
          board_id: Number(boardId),
          user_id: session?.user.id,
          content,
          parent_id: type === 'reply' ? parentId : null,
        });
        reset();

        if (type === 'reply') {
          onSuccess?.();
        }
      }

      const actionText = mode === 'create' ? '작성' : '수정';
      const typeText = type === 'comment' ? '댓글' : '답글';

      toast({
        title: `${typeText} ${actionText}에 성공했습니다.`,
      });
    } catch (error) {
      const actionText = mode === 'create' ? '작성' : '수정';
      const typeText = type === 'comment' ? '댓글' : '답글';

      if (error instanceof Error) {
        toast({
          title: `${typeText} ${actionText} 실패`,
          description: error.message ?? '알 수 없는 오류가 발생했습니다.',
          variant: 'destructive',
        });
      }
      throw error;
    }
  };

  const handleContentChange = () => {
    const content = getValues('content');
    if (content?.trim()) {
      clearErrors('content');
    }
  };

  const getPlaceholder = () => {
    if (mode === 'edit') {
      return type === 'comment' ? '댓글을 수정해 주세요.' : '답글을 수정해 주세요.';
    }
    return type === 'comment' ? '댓글을 입력해 주세요.' : '답글을 입력해 주세요.';
  };

  return (
    <ThreadView
      form={form}
      onSubmit={onSubmit}
      placeholder={getPlaceholder()}
      submitButtonLabel="등록"
      onContentChange={handleContentChange}
    />
  );
};

export default CommentForm;
