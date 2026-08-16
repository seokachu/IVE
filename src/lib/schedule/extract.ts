import type { FeedItem } from "@/types/news";
import type { ScheduleCategory } from "@/types/schedule";

//일정 관련 키워드 → 카테고리 매핑 (앞에 있을수록 우선)
const CATEGORY_KEYWORDS: { category: ScheduleCategory; keywords: string[] }[] = [
  { category: "concert", keywords: ["콘서트", "월드투어", "단독 공연", "투어", "페스티벌", "내한"] },
  { category: "fanmeeting", keywords: ["팬미팅", "팬사인회", "팬싸", "팬콘", "팬 사인회"] },
  { category: "popup", keywords: ["팝업 스토어", "팝업스토어", "팝업"] },
  { category: "comeback", keywords: ["컴백", "타이틀곡", "신곡"] },
  { category: "release", keywords: ["발매", "미니앨범", "정규앨범", "싱글", "선공개"] },
  { category: "broadcast", keywords: ["방송 출연", "출연 확정", "뮤직뱅크", "음악중심", "인기가요", "엠카운트다운"] },
];

export interface ExtractedSchedule {
  title: string;
  category: ScheduleCategory;
  startsAt: string;
  endsAt: string | null;
  link: string;
  description: string | null;
}

const findCategory = (text: string): ScheduleCategory | null => {
  for (const { category, keywords } of CATEGORY_KEYWORDS) {
    if (keywords.some((keyword) => text.includes(keyword))) return category;
  }
  return null;
};

//"N월 N일" / "N월 N~M일" / "N월 N일부터 M일까지" 패턴에서 날짜 추출
const DATE_PATTERN = /(\d{1,2})월\s*(\d{1,2})(?:일)?\s*(?:[~∼-]|부터)?\s*(?:(\d{1,2})일)?/;

const toKstIso = (year: number, month: number, day: number) =>
  `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T00:00:00+09:00`;

const isValidDate = (year: number, month: number, day: number) => {
  const date = new Date(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
  return month >= 1 && month <= 12 && day >= 1 && !Number.isNaN(date.getTime()) && date.getDate() === day;
};

//기사 발행 시점을 기준으로 연도 추정 (발행일보다 2달 이상 과거 월이면 다음 해로 판단)
const extractDate = (text: string, publishedAt: string) => {
  const match = text.match(DATE_PATTERN);
  if (!match) return null;

  const published = new Date(publishedAt);
  const month = Number(match[1]);
  const day = Number(match[2]);
  const endDay = match[3] ? Number(match[3]) : null;

  let year = published.getFullYear();
  if (month < published.getMonth() + 1 - 2) year += 1;

  if (!isValidDate(year, month, day)) return null;

  return {
    startsAt: toKstIso(year, month, day),
    endsAt: endDay && endDay > day && isValidDate(year, month, endDay) ? toKstIso(year, month, endDay) : null,
  };
};

//뉴스 피드에서 날짜가 명시된 일정 후보만 추출 (영상 제외)
export const extractSchedules = (feedItems: FeedItem[]): ExtractedSchedule[] => {
  return feedItems
    .filter((item) => item.sourceType !== "youtube")
    .flatMap((item) => {
      const text = `${item.title} ${item.summary}`;
      const category = findCategory(text);
      if (!category) return [];

      const date = extractDate(text, item.publishedAt);
      if (!date) return [];

      return [
        {
          title: item.title,
          category,
          startsAt: date.startsAt,
          endsAt: date.endsAt,
          link: item.url,
          description: item.summary ? item.summary.slice(0, 300) : null,
        },
      ];
    });
};
