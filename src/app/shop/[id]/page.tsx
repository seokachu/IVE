import FaqSection from "@/components/shop/product/FaqSection";
import ProductSection from "@/components/shop/product/ProductSection";
import { generateMetadata } from "@/metadata/shop/shopDetailMetadata";

export { generateMetadata };

const page = () => {
  return (
    //시안 기준: 히어로 배경이 화면 전체 폭을 쓰도록 페이지 레벨 컨테이너 제거
    <main className="min-h-screen pt-14 pb-28">
      <ProductSection />
      <FaqSection />
    </main>
  );
};

export default page;
