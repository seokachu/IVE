import { Dispatch, SetStateAction } from "react";

export type ScheduleCategory = "concert" | "comeback" | "broadcast" | "fanmeeting" | "popup" | "release" | "etc";

export type ScheduleViewValue = "card" | "calendar";

export interface ScheduleItem {
  id: string;
  title: string;
  category: ScheduleCategory;
  startsAt: string;
  endsAt: string | null;
  location: string | null;
  link: string | null;
  description: string | null;
  source: "manual" | "kopis" | "auto";
  poster: string | null;
}

export interface ScheduleViewToggleProps {
  selectedView: ScheduleViewValue;
  setSelectedView: Dispatch<SetStateAction<ScheduleViewValue>>;
}

export interface ScheduleCardListProps {
  items: ScheduleItem[];
}

export interface ScheduleCardProps {
  item: ScheduleItem;
}

export interface ScheduleCalendarProps {
  items: ScheduleItem[];
}
