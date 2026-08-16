"use client";
import { useState } from "react";
import Image from "next/image";
import { ListMusic, ChevronDown } from "lucide-react";
import DefaultImage from "@/assets/images/default_image.avif";
import AlbumTrackList from "@/components/main/AlbumTrackList";
import StreamingLinkChips from "@/components/common/StreamingLinkChips";
import type { AlbumItemProps } from "@/types/main";

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
        <div className="dark">
          {showTracks && <AlbumTrackList albumTitle={album.title} albumImage={album.album_image} />}
          <div className="mt-4">
            <StreamingLinkChips albumTitle={album.title} melonLink={album.melon_link} appleLink={album.apple_link} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumListItem;
