"use client";
import { useState } from "react";
import { MapPin, ChevronDown } from "lucide-react";
import ScheduleCardDetail from "./ScheduleCardDetail";
import DdayBadge from "@/components/common/DdayBadge";
import { SCHEDULE_CATEGORY_MAP } from "@/utils/constants";
import { getDdayStatus, formatScheduleDate } from "@/utils/schedule";
import type { ScheduleCardProps } from "@/types/schedule";

const ScheduleCard = ({ item }: ScheduleCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const category = SCHEDULE_CATEGORY_MAP[item.category] ?? SCHEDULE_CATEGORY_MAP.etc;
  const dday = getDdayStatus(item);
  const isEnded = dday.state === "ended";

  return (
    <li>
      <button
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        className={`w-full text-left flex items-center gap-4 p-4 lg:p-5 border rounded-md transition-colors cursor-pointer ${
          expanded ? "rounded-b-none border-purple" : ""
        } ${isEnded ? "opacity-50" : "hover:border-purple"}`}
      >
        <DdayBadge item={item} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded-full text-xs ${category.badgeClass}`}>{category.label}</span>
            {item.source === "auto" && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-500">자동 수집</span>
            )}
            <time className="text-xs text-gray-400">{formatScheduleDate(item)}</time>
          </div>
          <h4 className="font-bold truncate lg:text-lg">{item.title}</h4>
          {item.location && (
            <p className="flex items-center gap-1 text-sm text-gray-500 mt-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{item.location}</span>
            </p>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 shrink-0 text-gray-400 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
        />
      </button>
      {expanded && <ScheduleCardDetail item={item} />}
    </li>
  );
};

export default ScheduleCard;
