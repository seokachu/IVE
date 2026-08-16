"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ScheduleCard from "./ScheduleCard";
import { isScheduleOnDate } from "@/utils/schedule";
import type { ScheduleCalendarProps } from "@/types/schedule";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

const ScheduleCalendar = ({ items }: ScheduleCalendarProps) => {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const moveMonth = (offset: number) => setViewDate(new Date(year, month + offset, 1));

  const isSameDate = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const selectedItems = items.filter((item) => isScheduleOnDate(item, selectedDate));

  return (
    <div>
      <div className="flex items-center justify-center gap-4 mb-6">
        <Button variant="plain" size="auto" onClick={() => moveMonth(-1)} aria-label="이전 달">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <span className="font-bold text-lg w-32 text-center">
          {year}년 {month + 1}월
        </span>
        <Button variant="plain" size="auto" onClick={() => moveMonth(1)} aria-label="다음 달">
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
      <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-2">
        {WEEKDAYS.map((day) => (
          <span key={day} className="py-2">
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
          const isSelected = isSameDate(date, selectedDate);
          const isToday = isSameDate(date, today);

          return (
            <button
              key={index}
              onClick={() => setSelectedDate(date)}
              className={`relative flex flex-col items-center justify-center aspect-square max-h-14 m-auto w-full rounded-md text-sm transition-colors ${
                isSelected ? "bg-purple text-white" : isToday ? "bg-gray-100 font-bold" : "hover:bg-gray-50"
              }`}
            >
              {index + 1}
              {hasSchedule && (
                <span className={`absolute bottom-1.5 w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-purple"}`} />
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-8">
        <h4 className="text-sm text-gray-500 mb-3">
          {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일 일정
        </h4>
        {selectedItems.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8">선택한 날짜에 일정이 없습니다.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {selectedItems.map((item) => (
              <ScheduleCard key={item.id} item={item} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ScheduleCalendar;
