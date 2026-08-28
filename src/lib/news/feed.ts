import { findNaverImage } from "@/lib/news/naverImage";
import type { FeedItem } from "@/types/news";

//피드 캐싱 주기(30분) — page/route revalidate와 동일하게 유지
export const FEED_REVALIDATE_SECONDS = 1800;

//IVE 공식 유튜브 채널 ID (https://www.youtube.com/@IVEstarship)
const IVE_YOUTUBE_CHANNEL_ID = "UC-Fnix71vRP64WXeo0ikd0Q";

//유튜브 Atom 피드는 채널당 최신 15개가 상한이라, 보조 채널에서 IVE 영상을 추가 수집해 영상 수를 늘린다
const EXTRA_YOUTUBE_CHANNELS = [
  { id: "UCweOkPb1wVVH0Q0Tlj4a5Pw", name: "1theK" },
  { id: "UCbD8EppRX3ZwJSou-TVo90A", name: "Mnet K-POP" },
] as const;

//공식 채널 재생목록 피드(각 15개) — 업로드 피드에 없는 영상을 보충해 영상 수를 늘린다
const IVE_YOUTUBE_PLAYLISTS = [
  "PLPhtNKiHTFyob6KUBxHdAdHlliwZTMBFc", //IVE STAGE
  "PLPhtNKiHTFyojdj9Vh58iGG2NEYxMMx1P", //IVE LOG
  "PLPhtNKiHTFyoOEiI_J6DjifSZvDFIR32O", //IVE-minute
  "PLPhtNKiHTFyp-lZVrrfEYwfEhNC_IHejw", //IVE'S WEEK
] as const;

//보조 채널은 여러 아티스트가 섞여 있어 제목으로 필터 — LIVE/DIVE 같은 단어 속 IVE는 제외
const IVE_VIDEO_PATTERN = /아이브|(?<![A-Za-z])IVE(?![A-Za-z])/;

const GOOGLE_NEWS_RSS_URL =
  "https://news.google.com/rss/search?q=%EC%95%84%EC%9D%B4%EB%B8%8C%20IVE&hl=ko&gl=KR&ceid=KR:ko";
const YOUTUBE_FEED_BASE_URL = "https://www.youtube.com/feeds/videos.xml";
//NAVER API Hub (구 개발자센터 검색 API가 네이버 클라우드 플랫폼으로 이관됨)
const NAVER_NEWS_API_URL =
  "https://naverapihub.apigw.ntruss.com/search/v1/news?query=%EC%95%84%EC%9D%B4%EB%B8%8C%20IVE&display=20&sort=date&format=json";

const FEED_ARTICLE_LIMIT = 50;
const FEED_VIDEO_LIMIT = 30;

//XML/HTML 문자열 정리 헬퍼
const decodeEntities = (text: string) =>
  text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");

const stripHtml = (text: string) => decodeEntities(text).replace(/<[^>]+>/g, "").trim();

const getTagContent = (block: string, tag: string) => {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return match ? match[1].trim() : "";
};

const getBlocks = (xml: string, tag: string) =>
  xml.match(new RegExp(`<${tag}[\\s>][\\s\\S]*?</${tag}>`, "g")) || [];

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

//중복 제거용 키 — 언론사 표기·공백·특수문자 차이를 무시하고 제목만 비교
const normalizeTitle = (title: string) =>
  title
    .replace(/\s*-\s*[^-]+$/, "")
    .replace(/[^\p{L}\p{N}]/gu, "")
    .toLowerCase();

//UA 없이 부르면 유튜브가 봇으로 보고 쓰로틀을 더 세게 건다 — 실측 8회 중 4회 성공이
//브라우저 UA를 붙이면 6회로 올라간다. 나머지는 재시도로 메운다.
const FEED_REQUEST_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
  Accept: "application/atom+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "ko-KR,ko;q=0.9,en;q=0.8",
} as const;

const fetchXml = async (url: string) => {
  const res = await fetch(url, {
    headers: FEED_REQUEST_HEADERS,
    next: { revalidate: FEED_REVALIDATE_SECONDS },
  });
  if (!res.ok) throw new Error(`피드 요청 실패 (${res.status}): ${url}`);
  return res.text();
};

//Google News RSS — API 키 불필요, 썸네일 없음
const fetchGoogleNews = async (): Promise<FeedItem[]> => {
  const xml = await fetchXml(GOOGLE_NEWS_RSS_URL);

  return getBlocks(xml, "item").map((block) => {
    const rawTitle = stripHtml(getTagContent(block, "title"));
    const sourceName = stripHtml(getTagContent(block, "source")) || "Google News";
    //구글 뉴스 제목은 "제목 - 언론사" 형태라 언론사 접미사를 제거, 구글이 자른 제목의 잔여 괄호도 정리
    const title = rawTitle
      .replace(new RegExp(`\\s*-\\s*${escapeRegExp(sourceName)}$`), "")
      .replace(/\s*[[(-]$/, "")
      .trim();

    return {
      id: `google-${getTagContent(block, "guid") || title}`,
      title,
      summary: "",
      url: decodeEntities(getTagContent(block, "link")),
      sourceType: "google" as const,
      sourceName,
      thumbnail: null,
      publishedAt: new Date(getTagContent(block, "pubDate")).toISOString(),
    };
  });
};

//유튜브 채널·재생목록 Atom 피드 — API 키 불필요, 썸네일 포함
const fetchYouTubeXmlFeed = async (feedQuery: string, sourceName: string): Promise<FeedItem[]> => {
  const xml = await fetchXml(`${YOUTUBE_FEED_BASE_URL}?${feedQuery}`);

  return getBlocks(xml, "entry").map((block) => {
    const videoId = getTagContent(block, "yt:videoId");

    return {
      id: `youtube-${videoId}`,
      title: stripHtml(getTagContent(block, "title")),
      summary: stripHtml(getTagContent(block, "media:description")).slice(0, 200),
      url: `https://www.youtube.com/watch?v=${videoId}`,
      sourceType: "youtube" as const,
      sourceName,
      thumbnail: block.match(/<media:thumbnail url="([^"]+)"/)?.[1] || null,
      publishedAt: new Date(getTagContent(block, "published")).toISOString(),
    };
  });
};

//유튜브는 같은 IP에서 피드를 몰아서 요청하면 일부를 404/500으로 흘려버린다 — 단독으로 부르면
//200인 URL이 7건을 동시에 던지면 500으로 돌아온다. 실패해도 Promise.allSettled가 삼켜서
//영상이 통째로 비어도 조용했다(히어로 배경 영상이 사라진 원인).
//공식 채널은 히어로 배경 영상의 유일한 출처라 넉넉히 재시도하고,
//보조 소스는 실패해도 화면이 비지 않으므로 한 번만 더 두드린다(함수 실행 시간 보호).
const PRIMARY_RETRY_BACKOFF_MS = [1000, 2500];
const SECONDARY_RETRY_BACKOFF_MS = [800];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

//쓰로틀은 일시적이라 잠깐 쉬었다 다시 부르면 통과한다 — 공식 채널 기준 실측 8/8
const fetchYouTubeXmlFeedWithRetry = async (
  feedQuery: string,
  sourceName: string,
  backoffMs: readonly number[]
): Promise<FeedItem[]> => {
  for (const delay of backoffMs) {
    try {
      return await fetchYouTubeXmlFeed(feedQuery, sourceName);
    } catch {
      await sleep(delay);
    }
  }
  return fetchYouTubeXmlFeed(feedQuery, sourceName);
};

const fetchYouTubeFeed = async (): Promise<FeedItem[]> => {
  //공식 채널 피드는 히어로 배경 영상(쇼츠가 아닌 최신 공식 영상)의 유일한 출처다.
  //보조 피드와 같이 던지면 쓰로틀에 같이 휩쓸리므로 **단독으로 먼저** 받는다.
  const primary = await fetchYouTubeXmlFeedWithRetry(
    `channel_id=${IVE_YOUTUBE_CHANNEL_ID}`,
    "IVE 공식 유튜브",
    PRIMARY_RETRY_BACKOFF_MS
  ).catch((error) => {
    console.error("[news] 공식 유튜브 채널 피드 실패", error);
    return [] as FeedItem[];
  });

  //나머지는 영상 수를 늘리는 보조 소스라 실패해도 화면이 비지 않는다
  const results = await Promise.allSettled([
    ...IVE_YOUTUBE_PLAYLISTS.map((playlistId) =>
      fetchYouTubeXmlFeedWithRetry(`playlist_id=${playlistId}`, "IVE 공식 유튜브", SECONDARY_RETRY_BACKOFF_MS)
    ),
    ...EXTRA_YOUTUBE_CHANNELS.map(async (channel) => {
      const items = await fetchYouTubeXmlFeedWithRetry(
        `channel_id=${channel.id}`,
        channel.name,
        SECONDARY_RETRY_BACKOFF_MS
      );
      return items.filter((item) => IVE_VIDEO_PATTERN.test(item.title));
    }),
  ]);

  for (const result of results) {
    if (result.status === "rejected") console.error("[news] 보조 유튜브 피드 실패", result.reason);
  }

  //같은 영상이 업로드 피드와 재생목록에 중복으로 잡히면 하나만 유지
  const items = [
    ...primary,
    ...results.flatMap((result) => (result.status === "fulfilled" ? result.value : [])),
  ];
  return [...new Map(items.map((item) => [item.id, item])).values()];
};

//네이버 뉴스 검색 API — NAVER_CLIENT_ID/SECRET 없으면 자동 스킵
const fetchNaverNews = async (): Promise<FeedItem[]> => {
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;
  if (!clientId || !clientSecret) return [];

  const res = await fetch(NAVER_NEWS_API_URL, {
    headers: { "X-NCP-APIGW-API-KEY-ID": clientId, "X-NCP-APIGW-API-KEY": clientSecret },
    next: { revalidate: FEED_REVALIDATE_SECONDS },
  });
  if (!res.ok) throw new Error(`네이버 뉴스 API 요청 실패 (${res.status})`);

  const data: {
    items: { title: string; originallink: string; link: string; description: string; pubDate: string }[];
  } = await res.json();

  return data.items.map((item) => {
    const url = item.originallink || item.link;
    let sourceName = "네이버 뉴스";
    try {
      sourceName = new URL(url).hostname.replace(/^www\./, "");
    } catch {
      //원문 링크가 유효한 URL이 아니면 기본 표기 유지
    }

    return {
      id: `naver-${url}`,
      title: stripHtml(item.title),
      summary: stripHtml(item.description),
      url,
      sourceType: "naver" as const,
      sourceName,
      thumbnail: null,
      publishedAt: new Date(item.pubDate).toISOString(),
    };
  });
};

//세 소스를 병합 — 실패한 소스는 건너뛰고 나머지로 응답
export const getNewsFeed = async (): Promise<FeedItem[]> => {
  const results = await Promise.allSettled([fetchNaverNews(), fetchGoogleNews(), fetchYouTubeFeed()]);

  const items = results.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
  if (items.length === 0) throw new Error("모든 뉴스 소스를 가져오는데 실패했습니다.");

  //같은 제목이 여러 소스에서 잡히면 썸네일 있는 쪽(유튜브)을 우선
  const byTitle = new Map<string, FeedItem>();
  for (const item of items) {
    const key = normalizeTitle(item.title);
    const existing = byTitle.get(key);
    if (!existing || (!existing.thumbnail && item.thumbnail)) byTitle.set(key, item);
  }

  const byDateDesc = (a: FeedItem, b: FeedItem) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();

  //영상은 채널당 최신 15개뿐이라 기사에 밀려 잘리지 않도록 소스별로 따로 컷
  const sorted = [...byTitle.values()].sort(byDateDesc);
  const videos = sorted.filter((item) => item.sourceType === "youtube").slice(0, FEED_VIDEO_LIMIT);
  const articles = sorted.filter((item) => item.sourceType !== "youtube").slice(0, FEED_ARTICLE_LIMIT);
  const deduped = [...videos, ...articles].sort(byDateDesc);

  //썸네일 없는 기사는 이미지 검색으로 대표 이미지를 채움 (검색 결과는 하루 캐싱)
  return Promise.all(
    deduped.map(async (item) => {
      if (item.thumbnail) return item;
      const thumbnail = await findNaverImage(item.title);
      return thumbnail ? { ...item, thumbnail } : item;
    })
  );
};
