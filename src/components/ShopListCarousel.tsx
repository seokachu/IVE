import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { musicIcon } from "@/lib/data";
import Image from "next/image";
import { LuMusic4 } from "react-icons/lu";
import Link from "next/link";
import TestImage from "@/assets/images/test.webp";

const ShopListCarousel = () => {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full m-auto max-w-sm md:max-w-md lg:max-w-[100%]"
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem
            key={index}
            className="md:basis-1/2 mr-16 lg:w-[calc(100%/2.5)]"
          >
            <li className="">
              <Image src={TestImage} alt="앨범" />
              <h3 className="text-xl lg:text-2xl font-bold text-center mt-5">
                SWITCH 앨범제목
              </h3>
              <ul>
                <li className="flex justify-center gap-3 text-sm lg:text-base text-silver-gray opacity-90">
                  <p className="relative after:content-['•'] after:absolute after:left-[calc(100%+4px)] after:top-0">
                    2024.10.15
                  </p>
                  <p className="relative after:content-['•'] after:absolute after:left-[calc(100%+4px)] after:top-0">
                    j팝
                  </p>
                  <p>1곡</p>
                </li>
              </ul>
              <h3 className="flex items-center justify-center gap-1 font-bold my-5 border-b-[1px] pb-3">
                <LuMusic4 size={20} className="translate-y-[1px]" />
                음원듣기
              </h3>
              <ul className="flex items-center justify-center gap-3">
                {musicIcon.map((el, index) => (
                  <li key={index}>
                    <Link href="" target="_blank" className="size-10 block">
                      <Image
                        src={el.icon}
                        alt={el.label}
                        className="rounded-[40px] object-cover size-10"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default ShopListCarousel;
