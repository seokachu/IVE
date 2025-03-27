import Image from "next/image";
import AlbumSection from "@/components/main/AlbumSection";
import VisualSection from "@/components/main/VisualSection";
import BoardSection from "@/components/main/BoardSection";
import ShopSection from "@/components/main/ShopSection";
import PhotoCardImage from "@/assets/images/main_photo_card.avif";
import GoTopButton from "@/components/common/button/GoTopButton";

export default function Home() {
  return (
    <main>
      <div className="relative min-h-[100vh]">
        <VisualSection />
        <AlbumSection />
      </div>
      <div className="relative z-10 bg-white">
        <BoardSection />
        <section className="bg-[#f9f9f9]">
          <div className="max-w-[1280px] m-auto flex flex-col items-center justify-center pt-12 lg:flex-row lg:gap-10 overflow-hidden lg:pt-0">
            <div className="mx-5 text-center lg:text-left">
              <h2 className="text-2xl lg:text-4xl font-bold">굿즈샵 오픈!</h2>
              <p className="mt-4">지금 회원가입하고 특별한 할인 혜택으로 굿즈를 만나보세요!</p>
            </div>
            <div className="translate-y-14">
              <Image src={PhotoCardImage} alt="PhotoCardImages" />
            </div>
          </div>
        </section>
        <ShopSection />
      </div>
      <GoTopButton />
    </main>
  );
}
