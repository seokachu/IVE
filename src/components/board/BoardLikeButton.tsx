import ActionButton from '@/components/common/button/ActionButton';
import { AiOutlineLike } from 'react-icons/ai';
import { AiFillLike } from 'react-icons/ai';
import { sessionState } from '@/store';
import { useRecoilValue } from 'recoil';
import { toast } from '@/hooks/use-toast';
import { useLikeStatus, useToggleLike } from '@/hooks/queries/useLike';
import useAuthGuard from '@/hooks/useAuthGuard';
import type { BoardDetailProps } from '@/types/board';

const BoardLikeButton = ({ item }: BoardDetailProps) => {
  const session = useRecoilValue(sessionState);
  const userId = session?.user?.id;

  //좋아요 상태 query
  const { data: isLiked } = useLikeStatus(item.id, userId);
  const { mutate: toggleLike, isPending } = useToggleLike(item.id, userId);
  const { checkAuth } = useAuthGuard();

  const handleToggleLikeClick = () => {
    if (!checkAuth()) return;

    toggleLike(undefined, {
      onSuccess: (newStatus) => {
        toast({
          title: newStatus ? '좋아요를 눌렀습니다.' : '좋아요가 취소되었습니다.',
        });
      },
    });
  };

  return (
    <div className="flex items-center justify-center mb-5">
      <ActionButton
        variant="default"
        className={`flex items-center gap-1 py-3 px-3 hover:bg-silver-gray ${isLiked ? 'bg-silver-gray' : ''} `}
        onClick={handleToggleLikeClick}
        disabled={isPending}
      >
        {!isLiked ? <AiOutlineLike size={20} /> : <AiFillLike size={20} />}
        <span>{item?.board_likes[0]?.count || 0}</span>
      </ActionButton>
    </div>
  );
};

export default BoardLikeButton;
