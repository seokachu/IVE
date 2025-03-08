import { newsMetadata } from "@/metadata/news/newsMetadata";
import HeroSection from "@/components/news/HeroSection";
import GoTopButton from "@/components/common/button/GoTopButton";
import LatestNewsSection from "@/components/news/LatestNewsSection";
import GallerySection from "@/components/news/GallerySection";

export const metadata = newsMetadata;

const page = () => {
  return (
    <main>
      <HeroSection />
      <LatestNewsSection />
      <GallerySection />
      <GoTopButton />
    </main>
  );
};

export default page;
