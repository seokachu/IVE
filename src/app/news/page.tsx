import { newsMetadata } from "@/metadata/news/newsMetadata";
import HeroSection from "@/components/news/HeroSection";
import GoTopButton from "@/components/common/button/GoTopButton";
// import GallerySection from "@/components/news/GallerySection";
// import LatestNewsSection from "@/components/news/LatestNewsSection";

export const metadata = newsMetadata;

const page = () => {
  return (
    <main className="flex items-center justify-center h-screen bg-main-image bg-cover bg-center bg-no-repeat">
      <HeroSection />
      {/* <LatestNewsSection /> */}
      {/* <GallerySection /> */}
      <GoTopButton />
    </main>
  );
};

export default page;
