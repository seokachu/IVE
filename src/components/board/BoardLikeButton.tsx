// import ActionButton from "@/components/common/button/ActionButton";
// import { AiOutlineLike } from "react-icons/ai";
// import { AiFillLike } from "react-icons/ai";
import { sessionState } from "@/store";
import { useRecoilValue } from "recoil";
// import { toast } from "@/hooks/use-toast";
import type { BoardDetailProps } from "@/types";

const BoardLikeButton = ({ item }: BoardDetailProps) => {
  const session = useRecoilValue(sessionState);
  const userId = session?.user?.id;
  console.log(item);
  console.log(userId);
  //좋아요 상태 query
  // const { data: isLiked } = useLikeStatus(item.id, userId);
  // const { mutate: toggleLike, isPending } = useToggleLike(item.id, userId);

  // const handleToggleLikeClick = () => {
  //   if (!session) {
  //     toast({
  //       title: "로그인이 필요합니다.",
  //       description: "로그인 페이지로 이동하여 로그인 해주세요.",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  // toggleLike(undefined, {
  //   onSuccess: (newStatus) => {
  //     toast({
  //       title: newStatus
  //         ? "좋아요를 눌렀습니다."
  //         : "좋아요가 취소되었습니다.",
  //     });
  //   },
  // });
  // };

  return (
    <div className="flex items-center justify-center mb-5">
      {/* <ActionButton
        variant="default"
        className={`flex items-center gap-1 py-3 px-3 hover:bg-silver-gray ${
          isLiked ? "bg-silver-gray" : ""
        } `}
        onClick={handleToggleLikeClick}
        disabled={isPending}
      >
        {!isLiked ? <AiOutlineLike size={20} /> : <AiFillLike size={20} />}
        <span>{item?.board_likes[0]?.count || 0}</span>
      </ActionButton> */}
    </div>
  );
};

export default BoardLikeButton;
