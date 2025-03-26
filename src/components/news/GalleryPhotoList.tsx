import GalleryPhotoListItem from "./GalleryPhotoListItem";
import type { GalleryPhotoListProps } from "@/types/news";

const GalleryPhotoList = ({ gallery, onClick }: GalleryPhotoListProps) => {
  return (
    <ul className="mb-16 flex flex-wrap gap-8">
      {gallery.map((item) => (
        <GalleryPhotoListItem key={item.id} item={item} onClick={() => onClick(item)} />
      ))}
    </ul>
  );
};

export default GalleryPhotoList;
