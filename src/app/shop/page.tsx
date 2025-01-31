import GoTopButton from "@/components/common/button/GoTopButton";
import ShopContainer from "@/components/shop/ShopContainer";
import { shopMetadata } from "@/metadata/shop/shopMetadata";

export const metadata = shopMetadata;

const page = () => {
  return (
    <main className="w-full min-h-screen">
      <ShopContainer />
      <GoTopButton />
    </main>
  );
};

export default page;
