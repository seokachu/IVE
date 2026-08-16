//자동 수집 뉴스 피드
export type FeedSourceType = "naver" | "google" | "youtube";

export interface FeedItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  sourceType: FeedSourceType;
  sourceName: string;
  thumbnail: string | null;
  publishedAt: string;
}

export interface NewsFeedSectionProps {
  type: "video" | "article";
}

export interface NewsFeedListProps {
  items: FeedItem[];
}

export interface NewsFeedItemProps {
  item: FeedItem;
  index: number;
}
