import { getGoodsReviews } from "@/lib/supabase/review";
import { ReviewResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

interface UseReviewsProps {
  id: string;
  page: number;
}

export const useReviews = ({ id, page }: UseReviewsProps) => {
  return useQuery({
    queryKey: ["reviews", id, page] as const,
    queryFn: async (): Promise<ReviewResponse> => getGoodsReviews(id, page),
    placeholderData: (previousData) => previousData,
  });
};
