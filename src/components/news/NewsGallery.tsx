import { NEWS_CATEGORY_ARRAY } from '@/utils/constants';
import NewsGalleryItem from './NewsGalleryItem';
import type { NewsGalleryProps } from '@/types/news';

const NewsGallery = ({ selectedCategory, newsItems, onClick }: NewsGalleryProps) => {
  //선택된 카테고리 필터링
  const filteredItems =
    selectedCategory === NEWS_CATEGORY_ARRAY[0].category
      ? newsItems
      : newsItems.filter((item) => item.category === selectedCategory);

  return (
    <ul className="my-16 flex flex-wrap gap-8">
      {filteredItems.map((item, index) => (
        <NewsGalleryItem
          key={item.id}
          item={item}
          index={index}
          totalItems={filteredItems.length}
          onClick={() => onClick(item)}
        />
      ))}
    </ul>
  );
};

export default NewsGallery;
