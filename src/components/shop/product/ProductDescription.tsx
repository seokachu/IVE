import { useRef, useState } from "react";
import TabMenu from "./TabMenu";
import DescriptionTab from "./DescriptionTab";
import ReviewTab from "./ReviewTab";
import type { ShopMenuProps } from "@/types/shop";

const ProductDescription = ({ id }: ShopMenuProps) => {
  const [activeTab, setActiveTab] = useState<"description" | "review">("description");
  const sectionRef = useRef<HTMLDivElement>(null);

  //탭 전환 시 콘텐츠 높이가 급변해 스크롤이 아래 섹션(FAQ)에 떨어지는 것 방지 — 탭 상단으로 복귀
  const handleTabChange = (tab: "description" | "review") => {
    setActiveTab(tab);
    sectionRef.current?.scrollIntoView();
  };

  return (
    <div ref={sectionRef} className="w-full py-20 lg:py-24">
      <TabMenu id={id} activeTab={activeTab} setActiveTab={handleTabChange} />
      {activeTab === "description" ? <DescriptionTab id={id} /> : <ReviewTab id={id} />}
    </div>
  );
};

export default ProductDescription;
