import GalleryPhotoListItem from "./GalleryPhotoListItem";

const GalleryPhotoList = () => {
  return (
    <ul className="my-16 flex flex-wrap gap-8">
      <GalleryPhotoListItem />
      <GalleryPhotoListItem />
      <GalleryPhotoListItem />
      <GalleryPhotoListItem />
      <GalleryPhotoListItem />
    </ul>
  );
};

export default GalleryPhotoList;
