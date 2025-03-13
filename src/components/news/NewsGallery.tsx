import NewsGalleryItem from "./NewsGalleryItem";
import type { NewsGalleryProps } from "@/types";

const NewsGallery = ({
  selectedCategory,
  newsItems,
  onClick,
}: NewsGalleryProps) => {
  return (
    <ul className="my-16 flex flex-wrap gap-8">
      {newsItems.map((item, index) => (
        <NewsGalleryItem
          key={item.id}
          item={item}
          index={index}
          totalItems={newsItems.length}
          selectedCategory={selectedCategory}
          onClick={() => onClick(item)}
        />
      ))}
    </ul>
  );
};

export default NewsGallery;
