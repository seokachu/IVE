import { FaRegStar } from "react-icons/fa";
import PaginationControl from "@/components/common/PaginationControl";
import ReviewItems from "./ReviewItems";

const ReviewTab = () => {
  return (
    <>
      <div className="flex justify-center items-center mb-10">
        <div className="flex gap-1 mr-5">
          <FaRegStar size={25} />
          <FaRegStar size={25} />
          <FaRegStar size={25} />
          <FaRegStar size={25} />
          <FaRegStar size={25} />
        </div>
        <div className="flex items-center gap-2">
          <strong className="text-2xl">5.0</strong>
          <p className="text-dark-gray translate-y-[1px]">/5.0</p>
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold mb-2">리뷰 (11)</h2>
          <button className="py-2 px-5 bg-purple rounded-md text-sm text-white">
            글쓰기
          </button>
        </div>
        <ul>
          <ReviewItems />
        </ul>
        <PaginationControl />
      </div>
    </>
  );
};

export default ReviewTab;
