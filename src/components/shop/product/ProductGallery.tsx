"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import DefaultImage from "@/assets/images/default_image.avif";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Keyboard } from "swiper/modules";
import "swiper/css";

interface ProductGalleryProps {
  title: string;
  images: string[];
}

//시안 기준: 좌우 슬라이드 화살표 + 인덱스 필 + 썸네일 스트립 갤러리 (모바일 스와이프 지원)
const ProductGallery = ({ title, images }: ProductGalleryProps) => {
  const [current, setCurrent] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const total = images.length;
  const hasMultiple = total > 1;

  const goTo = (index: number) => {
    swiperRef.current?.slideTo((index + total) % total);
  };

  return (
    <div className="flex w-full flex-col gap-3 lg:w-1/2">
      <div className="relative w-full overflow-hidden rounded-3xl bg-gray-50 shadow-[0_16px_40px_rgba(169,79,192,0.16)]">
        <Swiper
          modules={[Keyboard]}
          keyboard={{ enabled: true }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => setCurrent(swiper.activeIndex)}
          className="aspect-square w-full"
        >
          {images.length > 0 ? (
            images.map((image, index) => (
              <SwiperSlide key={`${image}-${index}`}>
                <Image
                  src={image}
                  alt={`${title} 이미지 ${index + 1}`}
                  className="h-full w-full object-cover"
                  width={640}
                  height={640}
                  priority={index === 0}
                />
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <Image src={DefaultImage} alt={title} className="h-full w-full object-cover" width={640} height={640} priority />
            </SwiperSlide>
          )}
        </Swiper>
        {hasMultiple && (
          <>
            <Button
              variant="plain"
              size="auto"
              onClick={() => goTo(current - 1)}
              className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#EEEEEE] bg-white/90 text-gray-500 shadow-sm hover:text-purple-500"
              aria-label="이전 이미지"
            >
              <ChevronLeft size={20} />
            </Button>
            <Button
              variant="plain"
              size="auto"
              onClick={() => goTo(current + 1)}
              className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#EEEEEE] bg-white/90 text-gray-500 shadow-sm hover:text-purple-500"
              aria-label="다음 이미지"
            >
              <ChevronRight size={20} />
            </Button>
            <span className="absolute bottom-4 right-4 z-10 rounded-full bg-black/50 px-3 py-1 text-[11px] font-semibold text-white">
              {current + 1} / {total}
            </span>
          </>
        )}
      </div>
      {hasMultiple && (
        <ul className="flex gap-3">
          {images.map((image, index) => (
            <li key={`${image}-${index}`}>
              <button
                type="button"
                onClick={() => goTo(index)}
                className={`block h-[68px] w-[68px] overflow-hidden rounded-xl border transition-colors lg:h-[76px] lg:w-[76px] ${
                  index === current ? "border-2 border-purple" : "border-gray-200"
                }`}
                aria-label={`${index + 1}번째 이미지 보기`}
                aria-current={index === current}
              >
                <Image src={image} alt="" className="h-full w-full object-cover" width={76} height={76} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductGallery;
