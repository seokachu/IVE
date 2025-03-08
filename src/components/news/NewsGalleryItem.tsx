// import DefaultImage from "@/assets/images/default_image.avif";
import Image from "next/image";

interface NewsGalleryItemProps {
  item: {
    id: number;
    title: string;
    category: string;
    date: string;
    content: string;
  };
  index: number;
  totalItems: number;
}

const NewsGalleryItem = ({ item, index, totalItems }: NewsGalleryItemProps) => {
  const isOddCount = totalItems % 2 === 1;
  const itemWidth =
    isOddCount && index === 0 ? "lg:!w-full" : "lg:w-[calc(50%-1rem)]";

  return (
    <li
      className={`relative overflow-hidden border rounded-md group text-white w-full ${itemWidth}`}
    >
      <div className="aspect-[16/9]">
        <Image
          src="https://jzghadoanikvjvczuerw.supabase.co/storage/v1/object/public/goods/1-ep/album.webp"
          alt="test"
          className="absolute w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          width={500}
          height={500}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
        <div className="absolute bottom-0">
          <div className="flex items-center gap-2 p-3 text-sm">
            <span className="px-3 py-1 rounded-2xl bg-white/20 backdrop-blur-sm">
              {item.category}
            </span>
            <time className="opacity-75">{item.date}</time>
          </div>
          <div className="p-3 pt-0 text-white">
            <h3 className="text-xl font-bold mb-2 group-hover:text-purple transition-colors">
              {item.title}
            </h3>
            <p className="opacity-90 line-clamp-1 text-sm">{item.content}</p>
          </div>
        </div>
      </div>
    </li>
  );
};

export default NewsGalleryItem;
