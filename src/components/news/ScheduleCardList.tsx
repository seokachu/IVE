import ScheduleCard from "./ScheduleCard";
import { getDdayStatus } from "@/utils/schedule";
import type { ScheduleCardListProps } from "@/types/schedule";

const ScheduleCardList = ({ items }: ScheduleCardListProps) => {
  if (items.length === 0) {
    return <p className="text-center text-gray-500 py-16">등록된 일정이 없습니다.</p>;
  }

  const upcoming = items.filter((item) => getDdayStatus(item).state !== "ended");
  const ended = items.filter((item) => getDdayStatus(item).state === "ended");

  return (
    <div className="flex flex-col gap-8">
      <ul className="flex flex-col gap-3">
        {upcoming.length === 0 ? (
          <p className="text-center text-gray-500 py-16">다가오는 일정이 없습니다.</p>
        ) : (
          upcoming.map((item) => <ScheduleCard key={item.id} item={item} />)
        )}
      </ul>
      {ended.length > 0 && (
        <div>
          <h4 className="text-sm text-gray-400 mb-3">지난 일정</h4>
          <ul className="flex flex-col gap-3">
            {ended.map((item) => (
              <ScheduleCard key={item.id} item={item} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ScheduleCardList;
