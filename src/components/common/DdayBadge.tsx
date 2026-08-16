import { getDdayStatus } from "@/utils/schedule";
import type { ScheduleItem } from "@/types/schedule";

//사각(rounded-md) D-day 상태 뱃지 — 일정 카드·메인 티저 공통
const DDAY_BADGE_CLASS = {
  upcoming: "bg-purple-100 text-purple-500",
  today: "bg-purple text-white",
  ongoing: "bg-green-100 text-green-700",
  ended: "bg-gray-100 text-gray-400",
} as const;

const DdayBadge = ({ item }: { item: ScheduleItem }) => {
  const dday = getDdayStatus(item);
  return (
    <span className={`shrink-0 w-16 text-center text-sm font-bold py-2 rounded-md ${DDAY_BADGE_CLASS[dday.state]}`}>
      {dday.label}
    </span>
  );
};

export default DdayBadge;
