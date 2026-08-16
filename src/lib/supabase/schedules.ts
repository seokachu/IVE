import { supabase } from "@/lib/supabase/client";
import type { ScheduleItem, ScheduleCategory } from "@/types/schedule";

//수동 큐레이션 일정 가져오기 (지난 일정 30일까지 포함)
export const getManualSchedules = async (): Promise<ScheduleItem[]> => {
  const pastLimit = new Date();
  pastLimit.setDate(pastLimit.getDate() - 30);

  const { data, error } = await supabase
    .from("schedules")
    .select("*")
    .gte("starts_at", pastLimit.toISOString())
    .order("starts_at", { ascending: true });

  if (error) throw new Error(`일정 목록을 가져오는데 실패했습니다. ${error.message}`);

  return (data || []).map((row) => ({
    id: `manual-${row.id}`,
    title: row.title,
    category: row.category as ScheduleCategory,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    location: row.location,
    link: row.link,
    description: row.description,
    source: row.source === "auto" ? ("auto" as const) : ("manual" as const),
    poster: null,
  }));
};
