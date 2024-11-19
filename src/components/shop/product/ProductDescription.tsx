import TabMenu from "./TabMenu";
import DescriptionTab from "./DescriptionTab";
import ReviewTab from "./ReviewTab";
import { ProductProps } from "@/types";

const ProductDescription = ({ id }: ProductProps) => {
  console.log(id);
  return (
    <section className="py-28 w-full">
      <TabMenu />
      <DescriptionTab />
      <ReviewTab />
    </section>
  );
};

export default ProductDescription;
