import { getAlbums } from "@/lib/supabase/album";
import { useQuery } from "@tanstack/react-query";

export const useAlbums = () => {
  return useQuery({
    queryKey: ["albums"],
    queryFn: getAlbums,
  });
};
