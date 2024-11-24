import TabMenu from "./TabMenu";
import DescriptionTab from "./DescriptionTab";
import ReviewTab from "./ReviewTab";
import { ProductProps } from "@/types";

const ProductDescription = ({ id }: ProductProps) => {
  console.log(id);
  return (
    <div className="py-28 w-full">
      <TabMenu />
      <DescriptionTab />
      <ReviewTab />
    </div>
  );
};

export default ProductDescription;
