"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { isScheduleOnDate } from "@/utils/schedule";
import type { ScheduleCalendarProps } from "@/types/schedule";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

//선택 날짜는 부모(ScheduleSection)가 관리 — 캘린더는 표시와 날짜 선택만 담당
const ScheduleCalendar = ({ items, selectedDate, onSelectDate }: ScheduleCalendarProps) => {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const moveMonth = (offset: number) => setViewDate(new Date(year, month + offset, 1));

  const isSameDate = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  return (
    <div className="bg-background border border-gray-200 rounded-2xl p-5 lg:p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Button
          variant="plain"
          size="auto"
          onClick={() => moveMonth(-1)}
          aria-label="이전 달"
          className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="font-bold">
          {year}년 {month + 1}월
        </span>
        <Button
          variant="plain"
          size="auto"
          onClick={() => moveMonth(1)}
          aria-label="다음 달"
          className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      <div>
        <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-1">
          {WEEKDAYS.map((day) => (
            <span key={day} className="py-1.5">
              {day}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-1">
          {Array.from({ length: firstWeekday }).map((_, index) => (
            <span key={`empty-${index}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const date = new Date(year, month, index + 1);
            const hasSchedule = items.some((item) => isScheduleOnDate(item, date));
            //기간(멀티데이) 일정에 걸친 날은 은은한 배경으로 범위를 표시
            const inRange = items.some((item) => item.endsAt && isScheduleOnDate(item, date));
            const isSelected = isSameDate(date, selectedDate);
            const isToday = isSameDate(date, today);
            const isPast = date < today && !isToday;

            return (
              <button
                key={index}
                onClick={() => onSelectDate(date)}
                className={`relative flex flex-col items-center justify-center aspect-square max-h-12 m-auto w-full rounded-md text-sm transition-colors ${
                  isSelected
                    ? "bg-purple text-white font-bold"
                    : isToday
                      ? "bg-gray-100 font-bold"
                      : inRange
                        ? "bg-purple-50 hover:bg-purple-100"
                        : `hover:bg-gray-50 ${isPast ? "text-gray-400" : ""}`
                }`}
              >
                {index + 1}
                {hasSchedule && (
                  <span
                    className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-purple"}`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div className="border-t border-gray-200 pt-3 flex items-center gap-4 text-[11px] text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-purple" aria-hidden="true" />
          일정 있는 날
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-[3px] bg-purple" aria-hidden="true" />
          선택한 날짜
        </span>
      </div>
    </div>
  );
};

export default ScheduleCalendar;
