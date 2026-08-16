import ShopListCarousel from "@/components/main/items/ShopListCarousel";
import SectionTitle from "@/components/common/SectionTitle";
import MoreLink from "@/components/common/MoreLink";

const ShopSection = () => {
  return (
    <section>
      <div className="max-w-content m-auto px-5 pt-8 pb-32 flex justify-center align-center flex-col gap-8">
        <SectionTitle title="Shop" subtitle="지금 인기 있는 공식 굿즈" />
        <div className="flex justify-end">
          <MoreLink href="/shop" />
        </div>
        <ul className="-mt-4">
          <ShopListCarousel />
        </ul>
      </div>
    </section>
  );
};

export default ShopSection;
