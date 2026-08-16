"use client";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import AlbumTrackList from "@/components/main/AlbumTrackList";
import StreamingLinkChips from "@/components/common/StreamingLinkChips";
import DefaultImage from "@/assets/images/default_image.avif";
import { CATEGORY_BADGE_CLASS_ON_DARK, formatReleaseDate } from "@/components/discography/constants";
import type { DiscographyItem } from "@/lib/album/sync";

interface LatestReleaseHeroProps {
  album: DiscographyItem;
  /** 전체 발매 기준 최신인지 — 아니면 "최신 앨범"으로 표기 (리믹스 싱글 등이 더 최신인 경우) */
  isLatestRelease: boolean;
  onOpenDetail: () => void;
}

//최신 발매 히어로 — 메인 앨범 섹션과 같은 무드(다크 + 글로우)로 그리드 진입 전 최신작 강조
const LatestReleaseHero = ({ album, isLatestRelease, onOpenDetail }: LatestReleaseHeroProps) => {
  return (
    <section className="relative w-full bg-[#0A0A0A] overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute -left-20 top-24 w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle,rgba(219,151,233,0.35)_0%,rgba(219,151,233,0)_70%)]"
      />
      <div
        aria-hidden="true"
        className="absolute right-0 bottom-0 w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle,rgba(255,159,135,0.25)_0%,rgba(255,159,135,0)_70%)]"
      />
      <div className="relative max-w-content m-auto px-5 pt-32 pb-16 lg:pb-20 flex flex-col items-center gap-10 lg:gap-12">
        <div className="flex flex-col items-center gap-2 text-white">
          <h2 className="text-2xl font-bold lg:text-4xl text-center">Discography</h2>
          <h3 className="text-center text-white/60 text-sm lg:text-base">아이브의 모든 발매 — 정규 · 미니 · 싱글</h3>
        </div>

        <div className="w-full flex flex-col lg:flex-row items-center gap-8 lg:gap-14">
          <div className="relative w-full max-w-[300px] lg:max-w-none lg:w-[360px] shrink-0 aspect-square rounded-2xl overflow-hidden bg-white/10 shadow-[0_24px_64px_rgba(219,151,233,0.25)]">
            <Image
              src={album.image || DefaultImage}
              alt={album.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 300px, 360px"
            />
          </div>

          {/* 섹션이 항상 다크이므로 내부 배지·수록곡·칩은 다크 토큰으로 렌더 */}
          <div className="dark w-full lg:flex-1 min-w-0 text-white">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-[3px] rounded-full text-[10px] font-bold bg-orange-500 text-white">NEW</span>
              <span
                className={`px-2 py-[3px] rounded-full text-[11px] font-bold ${CATEGORY_BADGE_CLASS_ON_DARK[album.category]}`}
              >
                {album.category}
              </span>
            </div>
            <h4 className="text-2xl lg:text-3xl font-bold mt-2 truncate">{album.title}</h4>
            <p className="text-sm text-white/50 mt-1.5">
              {formatReleaseDate(album.releaseDate)} · {album.category} {album.trackCount}곡 ·{" "}
              {isLatestRelease ? "최신 발매" : "최신 앨범"}
            </p>
            <div className="mt-4">
              <AlbumTrackList albumTitle={album.title} albumImage={album.image} limit={3} />
            </div>
            <button
              onClick={onOpenDetail}
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-purple-300 hover:opacity-80 transition-opacity"
            >
              수록곡 전체 보기
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="mt-5">
              <StreamingLinkChips albumTitle={album.title} appleLink={album.appleLink} align="left" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestReleaseHero;
