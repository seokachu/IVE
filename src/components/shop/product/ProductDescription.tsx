import TabMenu from "./TabMenu";
import DescriptionTab from "./DescriptionTab";
import ReviewTab from "./ReviewTab";
import type { ShopMenuProps } from "@/types/shop";

interface ProductDescriptionProps extends ShopMenuProps {
  activeTab: "description" | "review";
  onTabChange: (tab: "description" | "review") => void;
}

//탭 상태는 ProductSection이 소유 — 구매 카드의 "리뷰 N개" 클릭으로도 전환할 수 있게
const ProductDescription = ({ id, activeTab, onTabChange }: ProductDescriptionProps) => {
  return (
    <div className="w-full py-20 lg:py-24">
      <TabMenu id={id} activeTab={activeTab} setActiveTab={onTabChange} />
      {activeTab === "description" ? <DescriptionTab id={id} /> : <ReviewTab id={id} />}
    </div>
  );
};

export default ProductDescription;
