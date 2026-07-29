import { Button } from "@/components/ui/button";
import { AiOutlineLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";
import { toast } from "@/hooks/use-toast";
import { useLikeStatus, useToggleLike } from "@/hooks/queries/useLike";
import useAuthGuard from "@/hooks/useAuthGuard";
import type { BoardLikeButtonProps } from "@/types/board";
import { useSession } from "@/store/zustand";

const BoardLikeButton = ({ item }: BoardLikeButtonProps) => {
  const session = useSession();
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
          title: newStatus
            ? "좋아요를 눌렀습니다."
            : "좋아요가 취소되었습니다.",
        });
      },
    });
  };

  return (
    <div className="flex items-center justify-center mb-5">
      <Button
        variant="outline" size="auto"
        className={`flex items-center gap-1 py-3 px-3 hover:bg-silver-gray ${
          isLiked ? "bg-silver-gray" : ""
        } `}
        onClick={handleToggleLikeClick}
        disabled={isPending}
      >
        {!isLiked ? <AiOutlineLike size={20} /> : <AiFillLike size={20} />}
        <span>{item.board_likes[0]?.count}</span>
      </Button>
    </div>
  );
};

export default BoardLikeButton;
