"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "@/styles/swiper.css";
import AlbumListItems from "./items/AlbumListItems";
import { useAlbums } from "@/hooks/queries/useAlbum";
import AlbumListLoading from "../common/loading/AlbumListLoading";
import Error from "../common/error/Error";

const AlbumList = () => {
  const { data: albums, isLoading, isError } = useAlbums();

  if (isLoading) return <AlbumListLoading />;
  if (isError) return <Error />;

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
      {albums?.map((album) => (
        <SwiperSlide
          key={album.title}
          className="bg-cover bg-center lg:!w-max lg:!h-full lg:pr-5"
        >
          <AlbumListItems album={album} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default AlbumList;
