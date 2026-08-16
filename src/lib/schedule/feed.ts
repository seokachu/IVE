import { getManualSchedules } from "@/lib/supabase/schedules";
import { getKopisSchedules } from "@/lib/schedule/kopis";
import { withImages } from "@/lib/schedule/image";
import type { ScheduleItem } from "@/types/schedule";

const normalizeTitle = (title: string) => title.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase();

//수동 일정 + KOPIS 공연을 병합 — 실패한 소스는 건너뛰고, 같은 일정은 수동 입력 우선
export const getScheduleFeed = async (): Promise<ScheduleItem[]> => {
  const results = await Promise.allSettled([getManualSchedules(), getKopisSchedules()]);
  const [manual, kopis] = results.map((result) => (result.status === "fulfilled" ? result.value : []));

  const manualTitles = new Set(manual.map((item) => normalizeTitle(item.title)));
  const merged = [...manual, ...kopis.filter((item) => !manualTitles.has(normalizeTitle(item.title)))];

  const sorted = merged.sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  return withImages(sorted);
};
