import DefaultImage from "@/assets/images/default_image.avif";
import Image from "next/image";
import { AiOutlineLike } from "react-icons/ai";
import ActionButton from "@/components/common/button/ActionButton";
import type { CommentListItemProps } from "@/types";
// import {
//   useDeleteComment,
//   useEditComment,
//   useRepliesCommentList,
// } from "@/hooks/queries/useComment";
import { formatDate } from "@/utils/formatDate";
import BoardActionButton from "../BoardActionButton";

const CommentListItem = ({ item, boardId }: CommentListItemProps) => {
  // const { mutate: deleteComment } = useDeleteComment(boardId, item.id);
  // const { mutate: editComment } = useEditComment(boardId);
  // const { data: replies } = useRepliesCommentList(item.id);

  console.log(boardId);

  console.log(item);
  return (
    <li className="py-5">
      <div className="flex justify-between items-start">
        <div className="flex gap-2 items-start mr-auto">
          <h3 className="relative w-[40px] h-auto overflow-hidden rounded-full border shrink-0">
            <Image
              src={item?.user?.avatar_url || DefaultImage}
              alt={item?.user?.name}
              className="fill"
              width={500}
              height={500}
            />
          </h3>
          <div>
            <div className="flex gap-2">
              <h2>{item?.user?.name}</h2>
              <time className="text-dark-gray">
                {formatDate(item?.created_at)}
              </time>
            </div>
            <p className="text-sm pr-3 py-1">{item.content}</p>
          </div>
        </div>
        <BoardActionButton />
      </div>
      <div className="flex items-center gap-4 pl-12 mt-1">
        <ActionButton
          variant="default"
          className="border-none flex items-center gap-1 hover:text-purple"
        >
          <AiOutlineLike size={15} />
          <span>0</span>
        </ActionButton>
        <ActionButton variant="default" className="border-none">
          답변
        </ActionButton>
      </div>
    </li>
  );
};

export default CommentListItem;
