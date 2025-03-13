import { getNewsGallery } from "@/lib/supabase/news";
import { useQuery } from "@tanstack/react-query";

export const useNewsGallery = () => {
  return useQuery({
    queryKey: ["News"],
    queryFn: getNewsGallery,
  });
};

// export const useNewsList = (id: string) => {
//   return useQuery({
//     queryKey: ["News"],
//     queryFn: getNewsLists,
//   });
// };
