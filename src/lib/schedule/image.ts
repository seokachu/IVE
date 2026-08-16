import { findNaverImage } from "@/lib/news/naverImage";
import type { ScheduleItem } from "@/types/schedule";

//포스터 없는 일정에 이미지 검색 결과를 채움
export const withImages = async (items: ScheduleItem[]): Promise<ScheduleItem[]> => {
  return Promise.all(
    items.map(async (item) => {
      if (item.poster) return item;
      const query = item.title.includes("아이브") || /\bIVE\b/i.test(item.title) ? item.title : `아이브 ${item.title}`;
      const poster = await findNaverImage(query);
      return poster ? { ...item, poster } : item;
    })
  );
};
