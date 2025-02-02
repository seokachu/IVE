import { useReviewCount } from "@/hooks/queries/useReviews";
import type { TabMenuProps } from "@/types";

const TabMenu = ({ activeTab, setActiveTab, id }: TabMenuProps) => {
  const { data } = useReviewCount(id);

  const count = data?.length;

  return (
    <div className="mb-16 sticky top-0 bg-white z-10">
      <ul className="flex justify-between items-center text-center cursor-pointer">
        <li
          onClick={() => setActiveTab("description")}
          className={`${
            activeTab === "description"
              ? "border-b-2 border-dark-gray"
              : "border-b"
          } w-2/4 py-4`}
        >
          <h3 className={`${activeTab === "description" ? "font-bold" : ""}`}>
            상세정보
          </h3>
        </li>
        <li
          onClick={() => setActiveTab("review")}
          className={`${
            activeTab === "review" ? "border-b-2 border-dark-gray" : "border-b"
          } w-2/4 py-4`}
        >
          <h3
            className={`${
              activeTab === "review" ? "font-bold" : ""
            } flex gap-2 justify-center items-center`}
          >
            리뷰<span>{count}</span>
          </h3>
        </li>
      </ul>
    </div>
  );
};

export default TabMenu;
