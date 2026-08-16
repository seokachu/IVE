"use client";
import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Keyboard } from "swiper/modules";
import "swiper/css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DefaultImage from "@/assets/images/default_image.avif";
import AlbumTrackList from "@/components/main/AlbumTrackList";
import StreamingLinkChips from "@/components/common/StreamingLinkChips";
import { useAlbums } from "@/hooks/queries/useAlbum";
import AlbumListLoading from "../common/loading/AlbumListLoading";
import Error from "../common/error/Error";

//커버플로우(좌) + 활성 앨범 정보 패널(우) — 앨범 전환 시 수록곡·스트리밍 칩 갱신
const AlbumShowcase = () => {
  const { data: albums, isLoading, isError } = useAlbums();
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (isLoading) return <AlbumListLoading />;
  if (isError) return <Error />;
  if (!albums || albums.length === 0) return null;

  const active = albums[activeIndex] || albums[0];

  return (
    <div className="w-full flex flex-col gap-10">
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
        <div className="w-full lg:w-[55%] min-w-0">
          <Swiper
            grabCursor
            centeredSlides
            loop
            slidesPerView="auto"
            spaceBetween={24}
            slideToClickedSlide
            keyboard={{ enabled: true }}
            modules={[Keyboard]}
            onSwiper={setSwiper}
            onSlideChange={(s) => setActiveIndex(s.realIndex)}
            wrapperTag="ul"
            className="w-full [&_.swiper-wrapper]:items-center"
          >
            {albums.map((album, index) => (
              <SwiperSlide key={album.title} tag="li" className="!w-auto">
                <div
                  className={`relative aspect-square rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
                    index === activeIndex
                      ? "w-[240px] lg:w-[340px]"
                      : "w-[130px] lg:w-[170px] opacity-40"
                  }`}
                >
                  <Image
                    src={album.album_image || DefaultImage}
                    alt={album.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 240px, 340px"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="w-full lg:w-[45%] text-white">
          <h3 className="text-2xl lg:text-3xl font-bold">{active.title}</h3>
          <p className="text-sm text-white/50 mt-1.5 mb-5">
            {[active.album_info, active.date, active.genre, active.total_song ? `${active.total_song}곡` : null]
              .filter(Boolean)
              .join(" · ")}
          </p>
          <div className="dark">
            <AlbumTrackList albumTitle={active.title} albumImage={active.album_image} />
          </div>
          <div className="mt-5">
            <StreamingLinkChips albumTitle={active.title} melonLink={active.melon_link} appleLink={active.apple_link} />
          </div>
        </div>
      </div>

      <nav aria-label="앨범 이동" className="hidden lg:flex items-center justify-center gap-5 text-white/60">
        <button
          onClick={() => swiper?.slidePrev()}
          aria-label="이전 앨범"
          className="hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-sm tabular-nums">
          {activeIndex + 1} / {albums.length}
        </span>
        <button
          onClick={() => swiper?.slideNext()}
          aria-label="다음 앨범"
          className="hover:text-white transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </nav>
    </div>
  );
};

export default AlbumShowcase;
