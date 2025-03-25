import Image from 'next/image';
import DefaultImage from '@/assets/images/default_image.avif';
import { FaRegCalendar } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';
import { formatDate } from '@/utils/formatDate';
import type { LatestNewsDetailProps } from '@/types/news';

const LatestNewsDetail = ({ item }: LatestNewsDetailProps) => {
  return (
    <div className="text-left">
      <div className="w-full h-[432px]">
        <Image
          src={item.image_url || DefaultImage}
          alt={item.title}
          width={1000}
          height={1000}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="px-5 py-5">
        <p className="inline-flex px-3 py-1 rounded-full bg-purple text-white text-sm">{item.category}</p>
        <h2 className="my-5 text-xl md:text-2xl font-bold text-gray-900">{item.title}</h2>
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center gap-1">
            <FaRegCalendar />
            <time>{formatDate(item.created_at, 'dash')}</time>
          </div>
          <div className="flex items-center gap-1">
            <FaUser />
            <span>{item.source}</span>
          </div>
        </div>
        <p className="mb-6 text-gray-700 leading-relaxed">{item.content}</p>
      </div>
    </div>
  );
};

export default LatestNewsDetail;
