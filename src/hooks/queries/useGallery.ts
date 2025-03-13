import { getGallery } from "@/lib/supabase/gallery";
import { useQuery } from "@tanstack/react-query";

export const useGallery = () => {
  return useQuery({
    queryKey: ["Gallery"],
    queryFn: getGallery,
  });
};

// export const useNewsList = (id: string) => {
//   return useQuery({
//     queryKey: ["News"],
//     queryFn: getNewsLists,
//   });
// };
