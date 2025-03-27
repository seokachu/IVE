"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "@/styles/swiper.css";
import AlbumListItem from "./items/AlbumListItem";
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
      className="w-full h-full !pb-[80px]"
      spaceBetween={50}
      wrapperTag="ul"
    >
      {albums?.map((album) => (
        <SwiperSlide key={album.title} tag="li" className="bg-cover h-fit bg-center lg:!w-max lg:!h-full lg:pr-5">
          <AlbumListItem album={album} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default AlbumList;
