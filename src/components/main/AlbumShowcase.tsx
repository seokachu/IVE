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
          {/* 슬롯 폭은 고정하고 활성 커버만 scale로 확대 — 레이아웃 재계산이 없어 배경·정렬이 흔들리지 않는다 */}
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
            className="w-full h-[250px] lg:h-[350px] [&_.swiper-wrapper]:items-center"
          >
            {albums.map((album, index) => (
              <SwiperSlide key={album.title} tag="li" className="!w-[170px] lg:!w-[240px] flex items-center h-full">
                <div
                  className={`relative aspect-square w-full rounded-2xl overflow-hidden transition-transform duration-300 ${
                    index === activeIndex
                      ? "scale-[1.35] z-10 shadow-2xl"
                      : "scale-[0.7] opacity-40"
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
            <StreamingLinkChips
              albumTitle={active.title}
              melonLink={active.melon_link}
              appleLink={active.apple_link}
              align="left"
            />
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
