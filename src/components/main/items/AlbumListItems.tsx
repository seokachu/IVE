import Image from "next/image";
import Link from "next/link";
import { LuMusic4 } from "react-icons/lu";
import { musicIcon } from "@/utils/constants";
import DefaultImage from "@/assets/images/album_img.webp";

import { AlbumItemProps } from "@/types";

const AlbumListItems = ({ album }: AlbumItemProps) => {
  const musicLinks = musicIcon.map((el) => {
    const link = (() => {
      switch (el.label.toLowerCase()) {
        case "apple":
          return album.apple_link;
        case "melon":
          return album.melon_link;
        case "flo":
          return album.flo_link;
        case "bugs":
          return album.bugs_link;
        case "genie":
          return album.genie_link;
        default:
          return "#";
      }
    })();
    return {
      ...el,
      link,
    };
  });

  return (
    <li
      key={album.title}
      className="flex flex-col items-center p-5 lg:flex-row lg:gap-12  lg:p-0"
    >
      <div className="relative w-[500px] h-auto lg:shrink-0">
        <Image
          src={album.album_image || DefaultImage}
          alt={album.title}
          className="fill object-cover"
          width={500}
          height={500}
        />
      </div>
      <div className="w-full">
        <h3 className="text-xl lg:text-2xl font-bold text-center mt-5 mb-2">
          {album.title}
        </h3>
        <ul>
          <li className="flex justify-center gap-3 text-sm lg:text-base text-silver-gray opacity-90">
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
        <h3 className="flex items-center justify-center gap-1 font-bold my-5 border-b-[1px] pb-3">
          <LuMusic4 size={20} className="translate-y-[1px]" />
          음원듣기
        </h3>
        <ul className="flex items-center justify-center gap-3">
          {musicLinks
            .filter((item) => item.link && item.link !== "#")
            .map((item) => (
              <li key={item.label}>
                <Link
                  href={String(item.link)}
                  target="_blank"
                  className="size-10 block"
                >
                  <Image
                    src={item.icon}
                    alt={item.label}
                    className="rounded-[40px] object-cover size-10"
                  />
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </li>
  );
};

export default AlbumListItems;
