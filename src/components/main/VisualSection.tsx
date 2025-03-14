"use client";
import { scrollState } from "@/store";
import { useRecoilValue } from "recoil";
import { cn } from "@/utils/utils";

const VisualSection = () => {
  const isScrolled = useRecoilValue(scrollState);
  const textStyle = "[text-shadow:_1px_3px_5px_rgb(0_0_0_/_0.3)] lg:text-xl";

  return (
    <section className="h-[100dvh] lg:h-screen w-full relative bg-main-image bg-cover bg-center bg-no-repeat flex items-center justify-center">
      <video
        className={cn(
          "h-[100dvh] lg:h-screen w-full object-cover fixed top-0 left-0",
          isScrolled ? "hidden" : "block"
        )}
        src="https://res.cloudinary.com/dknj7kdek/video/upload/v1729614511/%E1%84%89%E1%85%B5%E1%84%8F%E1%85%AF%E1%86%AB%E1%84%89%E1%85%B3_01_iaa8xa.mp4"
        autoPlay
        muted
        loop
        playsInline
        webkit-playsinline="true"
        preload="auto"
      />
      <ul className="absolute max-w-[1320px] w-full flex items-center text-center justify-center font-bold lg:justify-start lg:text-left">
        <li className="text-white lg:pl-20">
          <h1 className="[text-shadow:_1px_3px_5px_rgb(0_0_0_/_0.3)] text-3xl mb-5 tracking-wide lg:text-6xl">
            IVE INTO DIVE
          </h1>
          <p className={`${textStyle}`}>내 가수 정보를 한눈에!</p>
          <p className={`${textStyle}`}>
            나의 최애 가수에게 응원의 한마디를 남겨보세요.
          </p>
        </li>
      </ul>
      <div className="border-2 border-white w-8 h-11 absolute bottom-8 left-2/4 -translate-x-2/4 rounded-[32px]">
        <span className="bg-white w-1 h-3 absolute left-2/4 top-2 rounded-lg animate-wheels"></span>
      </div>
    </section>
  );
};

export default VisualSection;
