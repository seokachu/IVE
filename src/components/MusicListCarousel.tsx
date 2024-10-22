import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { musicIcon } from "@/lib/data";
import TestImage from "@/assets/images/test.webp";
import Image from "next/image";
import { LuMusic4 } from "react-icons/lu";
import Link from "next/link";

const MusicListCarousel = () => {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full max-w-sm"
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <li className="">
                <Image src={TestImage} alt="앨범" />
                <h3>SWITCH 앨범제목</h3>
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
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default MusicListCarousel;
