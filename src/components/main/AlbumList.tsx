"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "@/styles/swiper.css";
import AlbumListItems from "./items/AlbumListItems";

const AlbumList = () => {
  return (
    <Swiper
      effect={"coverflow"}
      grabCursor={true}
      centeredSlides={true}
      slidesPerView={"auto"}
      coverflowEffect={{
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      }}
      pagination={{
        type: "fraction",
      }}
      modules={[EffectCoverflow, Pagination]}
      className="w-full h-full !pb-[60px]"
      spaceBetween={50}
    >
      <SwiperSlide className="bg-cover bg-center lg:!w-max lg:!h-full lg:pr-5">
        <AlbumListItems />
      </SwiperSlide>
    </Swiper>
  );
};

export default AlbumList;
