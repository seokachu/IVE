import ShopListCarousel from "@/components/main/items/ShopListCarousel";
import Link from "next/link";

const ShopSection = () => {
  return (
    <section className="bg-white">
      <div className="max-w-[1280px] m-auto pt-16 px-5 pb-28 flex justify-center align-center flex-col">
        <h2 className="text-2xl font-bold lg:text-4xl text-center mb-12">
          SHOP
        </h2>
        <div className="w-full">
          <Link href="/shop" className="float-right">
            더보기
          </Link>
        </div>
        <ul className="mt-5">
          <ShopListCarousel />
        </ul>
      </div>
    </section>
  );
};

export default ShopSection;
