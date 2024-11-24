import { getGoodsReviews } from "@/lib/supabase/review";
import { useQuery } from "@tanstack/react-query";

export const useReviews = (id: string) => {
  return useQuery({
    queryKey: ["reviews", id],
    queryFn: () => getGoodsReviews(id),
  });
};
