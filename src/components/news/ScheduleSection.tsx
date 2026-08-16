"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ScheduleCardList from "./ScheduleCardList";
import ScheduleCalendar from "./ScheduleCalendar";
import Error from "../common/error/Error";
import ScheduleSkeleton from "../common/loading/ScheduleSkeleton";
import { SCHEDULE_VIEW_ARRAY } from "@/utils/constants";
import { useScheduleFeed } from "@/hooks/queries/useSchedule";
import type { ScheduleViewValue } from "@/types/schedule";

const ScheduleSection = () => {
  const [selectedView, setSelectedView] = useState<ScheduleViewValue>("card");
  const { data: schedules = [], isLoading, isError } = useScheduleFeed();

  if (isLoading) return <ScheduleSkeleton />;
  if (isError) return <Error />;

  return (
    <section className="max-w-content flex justify-center align-center flex-col px-5 pt-32 m-auto" id="schedule_section">
      <h2 className="text-2xl font-bold lg:text-4xl mb-6 text-center">Schedule</h2>
      <h3 className="text-center text-gray-600 mb-12">아이브의 콘서트, 컴백, 방송 일정을 놓치지 마세요</h3>
      <nav aria-label="일정 보기 방식" className="flex justify-center items-center mb-10">
        <ul className="flex items-center gap-2 p-1 bg-gray-100 rounded-full text-gray-600">
          {SCHEDULE_VIEW_ARRAY.map((el) => (
            <li
              key={el.value}
              className={`px-6 py-2 rounded-full whitespace-nowrap text-xs lg:text-sm ${
                selectedView === el.value ? "bg-background" : ""
              }`}
            >
              <Button
                variant="plain"
                size="auto"
                onClick={() => setSelectedView(el.value)}
                className={`font-normal hover:text-gray-900 ${selectedView === el.value ? "text-purple" : ""}`}
              >
                {el.label}
              </Button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="max-w-3xl w-full m-auto">
        {selectedView === "card" ? <ScheduleCardList items={schedules} /> : <ScheduleCalendar items={schedules} />}
      </div>
    </section>
  );
};

export default ScheduleSection;
