import { useReviewCount } from "@/hooks/queries/useReviews";
import type { TabMenuProps } from "@/types/shop";

//시안 기준: 세그먼트 필 탭 — 활성 탭은 서페이스 필 + 그림자
const TabMenu = ({ activeTab, setActiveTab, id }: TabMenuProps) => {
  const { data } = useReviewCount(id);

  const count = data?.length;

  const getTabClass = (isActive: boolean) =>
    `rounded-full px-7 py-2.5 text-sm transition-colors lg:px-8 ${
      isActive ? "bg-card font-bold shadow-sm" : "text-gray-500"
    }`;

  return (
    <div className="sticky top-0 z-10 mb-12 flex justify-center bg-background py-3 lg:mb-16">
      <div className="flex items-center gap-1 rounded-full bg-gray-100 p-1">
        <button type="button" onClick={() => setActiveTab("description")} className={getTabClass(activeTab === "description")}>
          상세정보
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("review")}
          className={`flex items-center gap-1.5 ${getTabClass(activeTab === "review")}`}
        >
          리뷰
          <span className="font-bold text-purple-500">{count}</span>
        </button>
      </div>
    </div>
  );
};

export default TabMenu;
