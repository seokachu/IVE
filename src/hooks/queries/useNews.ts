import { useQuery } from "@tanstack/react-query";
import type { FeedItem } from "@/types/news";

//자동 수집 뉴스 피드 가져오기
export const useNewsFeed = () => {
  return useQuery<FeedItem[]>({
    queryKey: ["newsFeed"],
    queryFn: async () => {
      const res = await fetch("/api/news/feed");
      if (!res.ok) throw new Error("뉴스 피드를 가져오는데 실패했습니다.");
      return res.json();
    },
    staleTime: 1000 * 60 * 30,
  });
};
