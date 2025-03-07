import ActionButton from "../common/button/ActionButton";

const HeroSection = () => {
  const textStyle = "[text-shadow:_2px_2px_5px_rgb(0_0_0_/_0.5)]";

  return (
    <section className="h-[100dvh] lg:h-screen flex flex-col gap-2 items-center justify-center">
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
          variant="primary"
          className="px-8 py-4 !rounded-full font-bold"
        >
          Latest News
        </ActionButton>
        <ActionButton
          variant="default"
          className="px-8 py-4 !rounded-full bg-white font-bold"
        >
          View Gallery
        </ActionButton>
      </div>
    </section>
  );
};

export default HeroSection;
