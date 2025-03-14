import Image from "next/image";
import DefaultImage from "@/assets/images/default_image.avif";
import type { GalleryPhotoDetailProps } from "@/types";

const GalleryPhotoDetail = ({ item }: GalleryPhotoDetailProps) => {
  return (
    <div>
      <div className="w-full">
        <Image
          src={item.image_url || DefaultImage}
          alt={`이미지 갤러리 리스트-${item.id}번째 사진 입니다.`}
          width={1000}
          height={1000}
          className="max-w-full max-h-[80vh] object-contain"
        />
      </div>
    </div>
  );
};

export default GalleryPhotoDetail;
