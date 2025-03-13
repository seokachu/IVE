import { getNewsGallery, getNewsGalleryById } from "@/lib/supabase/news";
import { DEFAULT_LIMIT } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";

//기본 5개 뉴스 가져오기
export const useNewsGallery = (limit = DEFAULT_LIMIT) => {
  return useQuery({
    queryKey: ["newsGallery"],
    queryFn: () => getNewsGallery(limit),
  });
};

//상세 뉴스 이동하기
export const useNewsGalleryDetail = (id: number) => {
  return useQuery({
    queryKey: ["newsGallery", id],
    queryFn: () => getNewsGalleryById(id),
    enabled: !!id,
  });
};
