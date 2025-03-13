import GalleryPhotoListItem from "./GalleryPhotoListItem";

interface GalleryPhotoListProps {
  gallery: {
    id: string;
    image_url: string;
    created_at: string;
  }[];
}

const GalleryPhotoList = ({ gallery }: GalleryPhotoListProps) => {
  return (
    <ul className="my-16 flex flex-wrap gap-8">
      {gallery.map((item) => (
        <GalleryPhotoListItem key={item.id} item={item} />
      ))}
    </ul>
  );
};

export default GalleryPhotoList;
