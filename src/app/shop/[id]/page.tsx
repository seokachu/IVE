import ProductAccordion from "@/components/shop/product/ProductAccordion";
import ProductInfo from "@/components/shop/product/ProductInfo";
import ProductDescription from "@/components/shop/product/ProductDescription";

const page = () => {
  return (
    <main className="px-5 pt-14 pb-28 lg:px-8 max-w-[1320px] m-auto flex flex-col items-center justify-center">
      <ProductInfo />
      <ProductDescription />

      <section className="w-full">
        <div>
          <h2 className="text-xl font-bold mb-5">자주 묻는 질문 FAQ</h2>
          <ProductAccordion />
        </div>
      </section>
    </main>
  );
};

export default page;
