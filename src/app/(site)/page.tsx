import Image from "next/image";
import TestImage from "@/assets/images/test.webp";
import { LuMusic4 } from "react-icons/lu";
import Link from "next/link";
import { musicIcon } from "@/lib/data";

export default function Home() {
  return (
    <>
      <section className="h-screen w-full relative bg-main-image bg-cover bg-center flex items-center justify-center bg-fixed -z-[1]">
        <video
          className="h-screen w-full object-cover fixed top-0 left-0 -z-[1]"
          src="https://res.cloudinary.com/dknj7kdek/video/upload/v1729614511/%E1%84%89%E1%85%B5%E1%84%8F%E1%85%AF%E1%86%AB%E1%84%89%E1%85%B3_01_iaa8xa.mp4"
          autoPlay
          muted
          loop
        />
        <ul className="absolute max-w-[1320px] w-full flex items-center text-center justify-center font-bold lg:justify-start lg:text-left">
          <li className="text-white lg:pl-20">
            <h1 className="[text-shadow:_1px_3px_5px_rgb(0_0_0_/_0.3)] text-5xl mb-5 tracking-wide lg:text-6xl">
              IVE INTO DIVE
            </h1>
            <p className="[text-shadow:_1px_3px_5px_rgb(0_0_0_/_0.3)] font-bold lg:text-xl">
              내 가수의 정보를 한눈에!
            </p>
            <p className="[text-shadow:_1px_3px_5px_rgb(0_0_0_/_0.3)] font-bold lg:text-xl">
              나의 최애 가수에게 응원의 한마디를 남겨보세요.
            </p>
          </li>
        </ul>
        <div className="border-2 border-white w-8 h-11 absolute bottom-8 left-2/4 -translate-x-2/4 rounded-[32px]">
          <span className="bg-white w-1 h-3 absolute left-2/4 top-2 rounded-lg animate-wheels"></span>
        </div>
      </section>
      <section className="h-screen w-full relative flex items-center justify-center">
        <video
          className="h-screen w-full object-cover absolute"
          src="https://res.cloudinary.com/dknj7kdek/video/upload/v1729011643/1110732_Animation_Blurred_3840x2160_diyuzd.mp4"
          autoPlay
          muted
          loop
        />
        <div className="absolute max-w-[1320px] w-full flex items-center justify-center flex-col lg:justify-start lg:text-left text-white">
          <h2 className="text-2xl lg:text-4xl">Album</h2>
          <ul className="">
            <li className="">
              <Image src={TestImage} alt="앨범" />
              <h3>SWITCH</h3>
              <ul>
                <li>
                  <p>2024.10.15</p>
                  <p>발라드</p>
                  <p>1곡</p>
                </li>
              </ul>
              <h3 className="flex items-center gap-1">
                <LuMusic4 size={30} />
                음원듣기
              </h3>
              <ul className="flex gap-2">
                {musicIcon.map((el, index) => (
                  <li key={index}>
                    <Link href="" target="_blank">
                      <Image
                        src={el.icon}
                        alt={el.label}
                        className="rounded-[46px]"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
      </section>
      <section>자유게시판</section>
      <section>굿즈샵</section>
    </>
  );
}
