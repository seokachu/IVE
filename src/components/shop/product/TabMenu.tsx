import { useShop } from "@/hooks/queries/useShops";
import type { TabMenuProps } from "@/types";

const TabMenu = ({ activeTab, setActiveTab, id }: TabMenuProps) => {
  const { data } = useShop(id);

  return (
    <div className="mb-28">
      <ul className="flex justify-between items-center text-center cursor-pointer">
        <li
          onClick={() => setActiveTab("description")}
          className={`${
            activeTab === "description"
              ? "border-b-2 border-dark-gray"
              : "border-b"
          } w-2/4 py-4`}
        >
          <h3 className="font-bold">상세정보</h3>
        </li>
        <li
          onClick={() => setActiveTab("review")}
          className={`${
            activeTab === "review" ? "border-b-2 border-dark-gray" : "border-b"
          } w-2/4 py-4`}
        >
          <h3 className="flex gap-2 justify-center items-center">
            리뷰<span>{data?.review_count}</span>
          </h3>
        </li>
      </ul>
    </div>
  );
};

export default TabMenu;
