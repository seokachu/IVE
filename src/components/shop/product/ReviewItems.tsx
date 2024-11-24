import { FaRegStar } from "react-icons/fa";
import { formatDate } from "@/utils/formatDate";
import UserAvatar from "@/components/common/UserAvatar";
import type { ReviewItemProps } from "@/types";

const ReviewItems = ({ item }: ReviewItemProps) => {
  return (
    <li className="border-b py-6">
      <div className="flex gap-4 justify-between items-center">
        <div className="flex gap-3">
          <UserAvatar size="md" />
          <div>
            <h3 className="font-bold">{item.user.name}</h3>
            <div className="flex gap-1 items-center justify-center">
              <div className="flex">
                <FaRegStar size={15} />
                <FaRegStar size={15} />
                <FaRegStar size={15} />
                <FaRegStar size={15} />
                <FaRegStar size={15} />
              </div>
              <strong className="-translate-y-[1px]">{item.rating}</strong>
            </div>
          </div>
        </div>
        <time className="text-dark-gray text-sm">
          {formatDate(item.created_at)}
        </time>
      </div>
      <p className="mt-3 px-2">{item.content}</p>
    </li>
  );
};

export default ReviewItems;
