import { useQuery } from "@tanstack/react-query";
import type { ScheduleItem } from "@/types/schedule";

//일정 피드 가져오기 (수동 + KOPIS)
export const useScheduleFeed = () => {
  return useQuery<ScheduleItem[]>({
    queryKey: ["scheduleFeed"],
    queryFn: async () => {
      const res = await fetch("/api/schedule");
      if (!res.ok) throw new Error("일정을 가져오는데 실패했습니다.");
      return res.json();
    },
    staleTime: 1000 * 60 * 30,
  });
};
