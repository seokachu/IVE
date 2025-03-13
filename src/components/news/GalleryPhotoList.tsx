import GalleryPhotoListItem from "./GalleryPhotoListItem";
import type { GalleryPhotoListProps } from "@/types";

const GalleryPhotoList = ({ gallery, onClick }: GalleryPhotoListProps) => {
  return (
    <ul className="my-16 flex flex-wrap gap-8">
      {gallery.map((item) => (
        <GalleryPhotoListItem
          key={item.id}
          item={item}
          onClick={() => onClick(item)}
        />
      ))}
    </ul>
  );
};

export default GalleryPhotoList;
