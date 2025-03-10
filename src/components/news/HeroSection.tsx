import ScrollToSectionButton from "./ScrollToSectionButton";

const HeroSection = () => {
  const textStyle = "[text-shadow:_1px_2px_5px_rgb(0_0_0_/_0.5)]";

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
        <ScrollToSectionButton />
      </div>
    </section>
  );
};

export default HeroSection;
