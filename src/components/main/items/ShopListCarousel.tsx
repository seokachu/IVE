"use client";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShopSkeleton from "@/components/common/loading/ShopSkeleton";
import ShopListItem from "@/components/shop/ShopListItem";
import { useShopCarousel } from "@/hooks/queries/useShops";

//기존 embla(ui/carousel) 반응형 폭과 동일: 모바일 65% / md 40% / lg 28%
const SLIDE_OPTIONS = {
  spaceBetween: 16,
  slidesPerView: 1.54,
  breakpoints: {
    768: { slidesPerView: 2.5 },
    1024: { slidesPerView: 3.57 },
  },
} as const;

const ShopListCarousel = () => {
  const { data: shopItems, isLoading } = useShopCarousel();
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);

  const navButtonStyle =
    "absolute top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full border border-gray-300 bg-background p-0 hover:bg-gray-100";

  return (
    <div className="relative w-full max-w-content">
      <Swiper {...SLIDE_OPTIONS} onSwiper={setSwiper} className="!px-5" wrapperTag="ul">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <SwiperSlide key={index} tag="li">
                <ShopSkeleton variant="carousel" />
              </SwiperSlide>
            ))
          : shopItems?.map((item) => (
              <SwiperSlide key={item.id} tag="li">
                <ShopListItem item={item} variant="carousel" />
              </SwiperSlide>
            ))}
      </Swiper>
      <Button
        variant="plain"
        size="auto"
        onClick={() => swiper?.slidePrev()}
        className={`${navButtonStyle} -left-4 lg:-left-12`}
        aria-label="이전 상품 보기"
      >
        <ChevronLeft size={16} />
      </Button>
      <Button
        variant="plain"
        size="auto"
        onClick={() => swiper?.slideNext()}
        className={`${navButtonStyle} -right-4 lg:-right-12`}
        aria-label="다음 상품 보기"
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
};

export default ShopListCarousel;
