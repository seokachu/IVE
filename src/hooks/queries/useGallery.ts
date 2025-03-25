import { getGallery } from '@/lib/supabase/gallery';
import { GALLERY_DEFAULT_LIMIT } from '@/utils/constants';
import { useQuery } from '@tanstack/react-query';

//전체 데이터 불러오기 (6개 제한)
export const useGallery = (limit = GALLERY_DEFAULT_LIMIT) => {
  return useQuery({
    queryKey: ['gallery', limit],
    queryFn: () => getGallery(limit),
  });
};
