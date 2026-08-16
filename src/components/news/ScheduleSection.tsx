"use client";
import { useMemo, useState } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionTitle from "@/components/common/SectionTitle";
import ScheduleCard from "./ScheduleCard";
import ScheduleCalendar from "./ScheduleCalendar";
import Error from "../common/error/Error";
import ScheduleSkeleton from "../common/loading/ScheduleSkeleton";
import { SCHEDULE_CATEGORY_MAP } from "@/utils/constants";
import { getDdayStatus, isScheduleOnDate } from "@/utils/schedule";
import { useScheduleFeed } from "@/hooks/queries/useSchedule";
import type { ScheduleCategory } from "@/types/schedule";

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

const ListDivider = ({ label }: { label: string }) => (
  <div className="flex items-center gap-3 pt-2">
    <h4 className="shrink-0 text-[13px] font-semibold text-gray-400">{label}</h4>
    <span className="h-px flex-1 bg-gray-200" aria-hidden="true" />
  </div>
);

//캘린더 + 일정 리스트를 나란히 보여주는 통합 뷰 (기존 카드/캘린더 토글 대체)
const ScheduleSection = () => {
  const [selectedCategory, setSelectedCategory] = useState<ScheduleCategory | "all">("all");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { data: schedules = [], isLoading, isError } = useScheduleFeed();

  //데이터에 실제로 존재하는 카테고리만 필터로 노출
  const filterOptions = useMemo(() => {
    const categories = Array.from(new Set(schedules.map((item) => item.category)));
    return [
      { value: "all" as const, label: "전체" },
      ...categories.map((value) => ({ value, label: (SCHEDULE_CATEGORY_MAP[value] ?? SCHEDULE_CATEGORY_MAP.etc).label })),
    ];
  }, [schedules]);

  if (isLoading) return <ScheduleSkeleton />;
  if (isError) return <Error />;

  const filtered =
    selectedCategory === "all" ? schedules : schedules.filter((item) => item.category === selectedCategory);
  const selectedItems = filtered.filter((item) => isScheduleOnDate(item, selectedDate));
  const rest = filtered.filter((item) => !selectedItems.includes(item));
  const upcoming = rest.filter((item) => getDdayStatus(item).state !== "ended");
  const ended = rest.filter((item) => getDdayStatus(item).state === "ended");

  return (
    <section className="max-w-content flex flex-col items-center px-5 pt-24 lg:pt-32 m-auto" id="schedule_section">
      <SectionTitle title="Schedule" subtitle="아이브의 콘서트, 컴백, 방송 일정을 놓치지 마세요" className="mb-8" />
      <nav aria-label="일정 카테고리 필터" className="mb-8 lg:mb-10 max-w-full overflow-x-auto">
        <ul className="flex items-center gap-1 p-1 bg-gray-100 rounded-full">
          {filterOptions.map((option) => (
            <li key={option.value}>
              <Button
                variant="plain"
                size="auto"
                onClick={() => setSelectedCategory(option.value)}
                className={`px-4 lg:px-5 py-2 rounded-full whitespace-nowrap text-xs lg:text-sm transition-colors ${
                  selectedCategory === option.value
                    ? "bg-background text-purple font-bold"
                    : "text-gray-500 font-normal hover:text-gray-900"
                }`}
              >
                {option.label}
              </Button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="w-full flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
        <div className="w-full lg:w-[400px] lg:shrink-0">
          <ScheduleCalendar items={filtered} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        </div>
        <div className="w-full flex-1 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-[18px] h-[18px] text-purple-500 dark:text-purple-300" />
            <h4 className="font-bold lg:text-lg">
              {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일 ({WEEKDAY_LABELS[selectedDate.getDay()]}) 일정
            </h4>
            {selectedItems.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-500 dark:text-purple-300">
                {selectedItems.length}건
              </span>
            )}
          </div>
          {selectedItems.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-8 border border-dashed border-gray-200 rounded-lg">
              선택한 날짜에 일정이 없어요.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {selectedItems.map((item) => (
                <ScheduleCard key={item.id} item={item} />
              ))}
            </ul>
          )}
          {upcoming.length > 0 && (
            <>
              <ListDivider label="다가오는 일정" />
              <ul className="flex flex-col gap-3">
                {upcoming.map((item) => (
                  <ScheduleCard key={item.id} item={item} />
                ))}
              </ul>
            </>
          )}
          {ended.length > 0 && (
            <>
              <ListDivider label="지난 일정" />
              <ul className="flex flex-col gap-3">
                {ended.map((item) => (
                  <ScheduleCard key={item.id} item={item} />
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ScheduleSection;
