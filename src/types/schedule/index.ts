export type ScheduleCategory = "concert" | "comeback" | "broadcast" | "fanmeeting" | "popup" | "release" | "etc";

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


export interface ScheduleCardProps {
  item: ScheduleItem;
}

export interface ScheduleCalendarProps {
  items: ScheduleItem[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}
