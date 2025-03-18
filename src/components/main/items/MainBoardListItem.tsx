import Image from "next/image";
import { BiCommentDots } from "react-icons/bi";
import DefaultImage from "@/assets/images/default_image.avif";
import { extractFirstImage } from "@/utils/extractImage";
import { useRouter } from "next/navigation";
import type { MainBoardListItemProps } from "@/types";

const MainBoardListItem = ({ item }: MainBoardListItemProps) => {
  const { push } = useRouter();
  const firstImage = item.content ? extractFirstImage(item.content) : null;
  const imageSrc = firstImage ? firstImage : DefaultImage;

  const handleBoardDetail = () => {
    push(`/board/${item.id}`);
  };

  return (
    <li
      onClick={handleBoardDetail}
      className="flex gap-5 items-center justify-center mt-5 w-full lg:w-2/4 lg:justify-start"
    >
      <div className="cursor-pointer flex gap-5 items-center w-full">
        <div className="border overflow-hidden rounded-lg">
          <Image
            src={imageSrc}
            alt={item.title || "게시글 이미지"}
            className="object-cover w-[70px] h-[70px] lg:w-[100px] lg:h-[100px]"
            width={500}
            height={500}
          />
        </div>
        <div className="flex flex-col gap-2 w-2/3">
          <h3 className="font-bold text-base lg:text-xl overflow-hidden text-ellipsis whitespace-nowrap">
            {item.title}
          </h3>
          <div className="flex gap-3 text-gray-400 text-sm">
            <p className="relative after:content-['•'] after:absolute after:left-[calc(100%+4px)] after:top-2/4 after:-translate-y-2/4">
              {item.user.name}
            </p>
            <div className="flex gap-1 items-center translate-y-[2px]">
              <BiCommentDots size={20} />
              <p className="-translate-y-[2px]">
                {item.board_comments[0]?.count || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default MainBoardListItem;
