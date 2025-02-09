import ActionButton from "@/components/common/button/ActionButton";
import { AiOutlineLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";

const BoardLikeButton = () => {
  return (
    <div className="flex items-center justify-center mb-5">
      <ActionButton
        variant="default"
        className="flex items-center gap-1 py-3 px-3 hover:bg-silver-gray"
      >
        <AiOutlineLike size={20} />
        <AiFillLike size={20} />
        <span>3</span>
      </ActionButton>
    </div>
  );
};

export default BoardLikeButton;
