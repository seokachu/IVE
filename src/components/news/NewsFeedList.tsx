import NewsFeedItem from "./NewsFeedItem";
import type { NewsFeedListProps } from "@/types/news";

const NewsFeedList = ({ items }: NewsFeedListProps) => {
  if (items.length === 0) {
    return <p className="text-center text-gray-500 py-20">표시할 소식이 없습니다.</p>;
  }

  return (
    <ul className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-16 mb-10">
      {items.map((item, index) => (
        <NewsFeedItem key={item.id} item={item} index={index} />
      ))}
    </ul>
  );
};

export default NewsFeedList;
