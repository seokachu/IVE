import { useNewsGallery } from "@/hooks/queries/useNews";
import NewsGalleryItem from "./NewsGalleryItem";
import type { NewsGalleryProps } from "@/types";

const NewsGallery = ({ selectedCategory }: NewsGalleryProps) => {
  console.log(selectedCategory);
  const { data: newsItems = [] } = useNewsGallery();

  return (
    <ul className="my-16 flex flex-wrap gap-8">
      {newsItems.map((item, index) => (
        <NewsGalleryItem
          key={item.id}
          item={item}
          index={index}
          totalItems={newsItems.length}
        />
      ))}
    </ul>
  );
};

export default NewsGallery;
