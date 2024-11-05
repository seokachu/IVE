import TabMenu from "./TabMenu";
import DescriptionTab from "./DescriptionTab";
import ReviewTab from "./ReviewTab";

const ProductDescription = () => {
  return (
    <section className="py-28 w-full">
      <TabMenu />
      {/* <DescriptionTab /> */}
      <ReviewTab />
    </section>
  );
};

export default ProductDescription;
