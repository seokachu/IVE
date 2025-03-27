import { useState } from "react";
import TabMenu from "./TabMenu";
import DescriptionTab from "./DescriptionTab";
import ReviewTab from "./ReviewTab";
import type { ShopMenuProps } from "@/types/shop";

const ProductDescription = ({ id }: ShopMenuProps) => {
  const [activeTab, setActiveTab] = useState<"description" | "review">("description");

  return (
    <div className="py-28 w-full">
      <TabMenu id={id} activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "description" ? <DescriptionTab id={id} /> : <ReviewTab id={id} />}
    </div>
  );
};

export default ProductDescription;
