import type { ScheduleItem } from "@/types/schedule";
import type { FeedItem } from "@/types/news";

const startOfDay = (value: string | Date) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

export type DdayStatus = { label: string; state: "upcoming" | "today" | "ongoing" | "ended" };

//일정의 D-day 상태 계산 (기간 일정은 진행중 표시)
export const getDdayStatus = (item: ScheduleItem): DdayStatus => {
  const today = startOfDay(new Date());
  const start = startOfDay(item.startsAt);
  const end = item.endsAt ? startOfDay(item.endsAt) : start;

  if (today < start) {
    const diff = Math.round((start.getTime() - today.getTime()) / 86400000);
    return { label: `D-${diff}`, state: "upcoming" };
  }
  if (today <= end) {
    return today.getTime() === start.getTime() && start.getTime() === end.getTime()
      ? { label: "D-DAY", state: "today" }
      : { label: "진행중", state: "ongoing" };
  }
  return { label: "종료", state: "ended" };
};

//일정이 특정 날짜에 걸쳐 있는지 (캘린더 표시용)
export const isScheduleOnDate = (item: ScheduleItem, date: Date) => {
  const target = startOfDay(date).getTime();
  const start = startOfDay(item.startsAt).getTime();
  const end = item.endsAt ? startOfDay(item.endsAt).getTime() : start;
  return target >= start && target <= end;
};

//모든 소식이 아이브 관련이라 변별력 없는 단어는 매칭에서 제외
const RELATED_STOPWORDS = new Set([
  "아이브", "ive", "공식", "오늘", "출연", "확정", "공개", "라인업",
  "까지", "부터", "최초", "최종", "이번", "위한", "대한",
]);

const tokenize = (text: string) =>
  text
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((token) => token.length >= 2 && !RELATED_STOPWORDS.has(token));

//일정 제목의 키워드가 포함된 소식을 관련도순으로 찾기 (팝업 상세용)
export const findRelatedNews = (item: ScheduleItem, feedItems: FeedItem[], limit = 4): FeedItem[] => {
  const tokens = tokenize(item.title);
  if (tokens.length === 0) return [];

  return feedItems
    .map((feedItem) => {
      const target = `${feedItem.title} ${feedItem.summary}`.toLowerCase();
      const score = tokens.filter((token) => target.includes(token)).length;
      return { feedItem, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ feedItem }) => feedItem);
};

//일정 기간 표시 문자열 (예: 8.14 (금) ~ 8.23 (일))
export const formatScheduleDate = (item: ScheduleItem) => {
  const format = (value: string) => {
    const date = new Date(value);
    const weekday = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
    return `${date.getMonth() + 1}.${date.getDate()} (${weekday})`;
  };
  return item.endsAt && startOfDay(item.endsAt).getTime() !== startOfDay(item.startsAt).getTime()
    ? `${format(item.startsAt)} ~ ${format(item.endsAt)}`
    : format(item.startsAt);
};
