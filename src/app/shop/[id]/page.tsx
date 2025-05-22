import ProductAccordion from "@/components/shop/product/ProductAccordion";
import ProductSection from "@/components/shop/product/ProductSection";
import { generateMetadata } from "@/metadata/shop/shopDetailMetadata";

export { generateMetadata };

const page = () => {
  return (
    <main className="px-5 pt-14 pb-28 lg:px-8 max-w-[1320px] m-auto flex flex-col items-center justify-center min-h-screen">
      <ProductSection />
      <section className="w-full">
        <div>
          <h2 className="text-lg lg:text-xl font-bold mb-5">
            자주 묻는 질문 FAQ
          </h2>
          <ProductAccordion />
        </div>
      </section>
    </main>
  );
};

export default page;
