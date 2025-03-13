import Image from "next/image";
import DefaultImage from "@/assets/images/default_image.avif";
import { FaSearchPlus } from "react-icons/fa";
import type { GalleryPhotoListItemProps } from "@/types";

const GalleryPhotoListItem = ({ item, onClick }: GalleryPhotoListItemProps) => {
  return (
    <li
      onClick={onClick}
      className="cursor-pointer relative overflow-hidden border rounded-md group text-white w-full md:w-[calc(50%-1rem)] lg:w-[calc(33%-1.2rem)]"
    >
      <div className="aspect-square">
        <Image
          src={item.image_url || DefaultImage}
          alt={`image gallery-${item.id}번째 입니다.`}
          className="absolute w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          width={500}
          height={500}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100" />
        <div className="absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <FaSearchPlus className="w-5 h-5 text-gray-900" />
        </div>
        <FaSearchPlus />
      </div>
    </li>
  );
};

export default GalleryPhotoListItem;
