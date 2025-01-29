import GoTopButton from "@/components/common/button/GoTopButton";
import ShopContainer from "@/components/shop/ShopContainer";
import { shopMetadata } from "@/metadata/shop/shopMetadata";

export const metadata = shopMetadata;

const page = () => {
  return (
    <main className="w-full min-h-screen">
      <section className="max-w-[1320px] m-auto pt-14 pb-28 lg:px-8">
        <ShopContainer />
      </section>
      <GoTopButton />
    </main>
  );
};

export default page;
