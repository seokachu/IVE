import type { BoardDetailProps } from "@/types";
import { formatDate } from "@/utils/formatDate";

const BoardDetailHeader = ({ item }: BoardDetailProps) => {
  return (
    <div>
      <h2 className="text-base lg:text-lg font-bold">{item?.title}</h2>
      <time className="text-gray-500 text-xs lg:text-sm">
        {formatDate(item?.created_at)}
      </time>
      <span className="ml-2 text-xs lg:text-sm text-gray-500">
        조회 {item?.views || 0}
      </span>
    </div>
  );
};

export default BoardDetailHeader;
