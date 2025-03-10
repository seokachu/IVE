"use client";
import ActionButton from "../common/button/ActionButton";

const HeroSection = () => {
  const textStyle = "[text-shadow:_1px_2px_5px_rgb(0_0_0_/_0.5)]";

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-[100dvh] lg:h-screen flex flex-col gap-2 items-center justify-center bg-main-image bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-0" />
      <div className="z-10 relative">
        <div className="mb-10 flex flex-col gap-5 items-center justify-center">
          <h1
            className={`text-white font-bold text-3xl lg:text-6xl ${textStyle}`}
          >
            IVE
          </h1>
          <h2 className={`text-white text-xl lg:text-2xl ${textStyle}`}>
            아이브와 함께하는 특별한 순간
          </h2>
        </div>
        <div className="flex items-center gap-5 flex-col lg:flex-row">
          <ActionButton
            onClick={() => scrollToSection("news_section")}
            variant="primary"
            className="px-8 py-4 !rounded-full font-bold"
          >
            Latest News
          </ActionButton>

          <ActionButton
            onClick={() => scrollToSection("gallery_section")}
            variant="default"
            className="px-8 py-4 !rounded-full bg-white font-bold"
          >
            View Gallery
          </ActionButton>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
