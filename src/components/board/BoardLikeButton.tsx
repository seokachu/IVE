import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
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
    <div className="flex flex-col items-center gap-2.5 py-2">
      <Button
        variant="plain"
        size="auto"
        className={`flex items-center gap-2 px-8 py-3.5 rounded-full text-white text-[15px] font-bold transition-all shadow-[0_4px_14px_rgba(219,151,233,0.4)] ${
          isLiked
            ? "bg-gradient-to-r from-purple-500 to-purple-400"
            : "bg-gradient-to-r from-purple-400 to-purple-300 hover:from-purple-500 hover:to-purple-400"
        }`}
        onClick={handleToggleLikeClick}
        disabled={isPending}
      >
        <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
        <span>추천 {item.board_likes[0]?.count || 0}</span>
      </Button>
      <p className="text-xs text-gray-400">
        이 글이 마음에 들었다면 하트로 응원해 주세요
      </p>
    </div>
  );
};

export default BoardLikeButton;
