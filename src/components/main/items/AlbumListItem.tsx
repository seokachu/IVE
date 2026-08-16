"use client";
import { useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ListMusic, ChevronDown } from "lucide-react";
import DefaultImage from "@/assets/images/default_image.avif";
import MelonMusicIcon from "@/assets/images/melon_music_icon.avif";
import AppleMusicIcon from "@/assets/images/apple_music_icon.avif";
import AlbumTrackList from "@/components/main/AlbumTrackList";
import type { AlbumItemProps } from "@/types/main";

const SpotifyIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
    <circle cx="12" cy="12" r="12" fill="#1DB954" />
    <path
      fill="#fff"
      d="M17.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 4.32-1.32 9.72-.659 13.44 1.62.361.181.54.78.301 1.201zm.12-3.36c-3.84-2.28-10.26-2.52-13.92-1.379-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.56.3z"
    />
  </svg>
);

const YoutubeMusicIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
    <circle cx="12" cy="12" r="12" fill="#FF0000" />
    <path
      fill="#fff"
      d="M12 5.772c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228s6.228-2.796 6.228-6.228S15.432 5.772 12 5.772zm0 11.58c-2.952 0-5.352-2.4-5.352-5.352S9.048 6.648 12 6.648s5.352 2.4 5.352 5.352-2.4 5.352-5.352 5.352zM9.684 15.54 15.816 12 9.684 8.46v7.08z"
    />
  </svg>
);

//풀버전 스트리밍 링크 — DB에 직접 링크가 있으면 우선, 없으면 검색 링크로 폴백
const getStreamingLinks = (album: AlbumItemProps["album"]): { label: string; url: string; icon: ReactNode }[] => {
  const query = encodeURIComponent(`아이브 ${album.title}`);
  return [
    {
      label: "멜론",
      url: album.melon_link || `https://www.melon.com/search/total/index.htm?q=${query}`,
      icon: <Image src={MelonMusicIcon} alt="" className="size-5 rounded-full object-cover" />,
    },
    {
      label: "Apple Music",
      url: album.apple_link || `https://music.apple.com/kr/search?term=${query}`,
      icon: <Image src={AppleMusicIcon} alt="" className="size-5 rounded-full object-cover" />,
    },
    { label: "Spotify", url: `https://open.spotify.com/search/${query}`, icon: <SpotifyIcon /> },
    { label: "YouTube Music", url: `https://music.youtube.com/search?q=${query}`, icon: <YoutubeMusicIcon /> },
  ];
};

const AlbumListItem = ({ album }: AlbumItemProps) => {
  const [showTracks, setShowTracks] = useState(true);

  return (
    <div key={album.title} className="flex flex-col items-center p-5 lg:flex-row lg:gap-12 lg:p-0">
      <div className="relative h-[40vh] sm:max-w-[300px] sm:max-h-[300px] lg:max-w-[500px] lg:min-h-[500px] lg:shrink-0 aspect-square">
        <Image
          src={album.album_image || DefaultImage}
          alt={album.title}
          className="fill object-cover w-full h-full"
          width={500}
          height={500}
          priority={true}
        />
      </div>
      <div className="w-full">
        <h3 className="text-xl lg:text-2xl font-bold text-center mt-5 mb-2">{album.title}</h3>
        <ul>
          <li className="flex justify-center gap-3 text-sm lg:text-base text-gray-200 opacity-90">
            <p className="relative after:content-['•'] after:absolute after:left-[calc(100%+4px)] after:top-0">
              {album.album_info}
            </p>
            <p className="relative after:content-['•'] after:absolute after:left-[calc(100%+4px)] after:top-0">
              {album.date}
            </p>
            <p className="relative after:content-['•'] after:absolute after:left-[calc(100%+4px)] after:top-0">
              {album.genre}
            </p>
            <p>{album.total_song}곡</p>
          </li>
        </ul>
        <button
          onClick={() => setShowTracks((prev) => !prev)}
          aria-expanded={showTracks}
          className="flex items-center justify-center gap-1 w-full font-bold mt-6 mb-2 border-b-[1px] border-white/40 pb-3 hover:opacity-80 transition-opacity"
        >
          <ListMusic size={20} className="translate-y-[1px]" />
          수록곡 미리듣기
          <ChevronDown size={16} className={`transition-transform duration-300 ${showTracks ? "rotate-180" : ""}`} />
        </button>
        {showTracks && <AlbumTrackList albumTitle={album.title} albumImage={album.album_image} />}
        <div className="flex items-center justify-center flex-wrap gap-2 mt-4 text-xs">
          <span className="opacity-70">풀버전 듣기</span>
          {getStreamingLinks(album).map((service) => (
            <Link
              key={service.label}
              href={service.url}
              target="_blank"
              className="inline-flex items-center gap-1.5 pl-1.5 pr-3 py-1 rounded-full bg-white/10 hover:bg-white/25 transition-colors"
            >
              {service.icon}
              {service.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlbumListItem;
