import { getNewsGallery } from "@/lib/supabase/news";
import { LATEST_DEFAULT_LIMIT } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";

//기본 5개 뉴스 가져오기
export const useNewsGallery = (limit = LATEST_DEFAULT_LIMIT) => {
  return useQuery({
    queryKey: ["news", limit],
    queryFn: () => getNewsGallery(limit),
  });
};
