import type { ScheduleItem } from "@/types/schedule";

//KOPIS(공연예술통합전산망) 공연목록 API — KOPIS_API_KEY 없으면 자동 스킵
//https는 301로 http에 리다이렉트되므로 서버 호출은 http를 직접 사용
const KOPIS_API_URL = "http://www.kopis.or.kr/openApi/restful/pblprfr";
const KOPIS_DETAIL_URL = "https://www.kopis.or.kr/por/db/pblprfr/pblprfrView.do?mt20Id=";
const KOPIS_REVALIDATE_SECONDS = 21600;

const getTagContent = (block: string, tag: string) => {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return match ? match[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim() : "";
};

//"2026.08.20" → ISO (KST 기준)
const toIsoDate = (kopisDate: string) => {
  const [y, m, d] = kopisDate.split(".");
  if (!y || !m || !d) return null;
  return `${y}-${m}-${d}T00:00:00+09:00`;
};

//"LIVE"/"FIVE" 오탐 방지를 위해 IVE는 단어 경계로 매칭
const isIveEvent = (title: string) => /아이브|\bIVE\b/i.test(title);

const formatYmd = (date: Date) =>
  `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;

//KOPIS는 조회 기간이 최대 31일이라 향후 90일을 31일 단위 구간으로 나눠 요청
const searchKopis = async (apiKey: string, keyword: string, windowIndex: number): Promise<ScheduleItem[]> => {
  const start = new Date();
  start.setDate(start.getDate() + windowIndex * 31);
  const end = new Date(start);
  end.setDate(end.getDate() + 30);

  const params = new URLSearchParams({
    service: apiKey,
    stdate: formatYmd(start),
    eddate: formatYmd(end),
    shprfnm: keyword,
    cpage: "1",
    rows: "100",
  });

  const res = await fetch(`${KOPIS_API_URL}?${params}`, {
    next: { revalidate: KOPIS_REVALIDATE_SECONDS },
  });
  if (!res.ok) throw new Error(`KOPIS API 요청 실패 (${res.status})`);
  const xml = await res.text();

  return (xml.match(/<db>[\s\S]*?<\/db>/g) || [])
    .map((block) => {
      const title = getTagContent(block, "prfnm");
      const mt20id = getTagContent(block, "mt20id");
      const startsAt = toIsoDate(getTagContent(block, "prfpdfrom"));
      const endsAt = toIsoDate(getTagContent(block, "prfpdto"));

      if (!title || !mt20id || !startsAt || !isIveEvent(title)) return null;

      return {
        id: `kopis-${mt20id}`,
        title,
        category: "concert" as const,
        startsAt,
        endsAt: endsAt === startsAt ? null : endsAt,
        location: getTagContent(block, "fcltynm") || null,
        link: `${KOPIS_DETAIL_URL}${mt20id}`,
        description: null,
        source: "kopis" as const,
        poster: getTagContent(block, "poster") || null,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
};

//매칭된 공연만 상세 API로 출연진·티켓·시간 정보를 가져와 설명 구성
const withDetail = async (apiKey: string, item: ScheduleItem): Promise<ScheduleItem> => {
  try {
    const mt20id = item.id.replace("kopis-", "");
    const res = await fetch(`${KOPIS_API_URL}/${mt20id}?service=${apiKey}`, {
      next: { revalidate: KOPIS_REVALIDATE_SECONDS },
    });
    if (!res.ok) return item;
    const xml = await res.text();

    const parts = [
      { label: "출연", value: getTagContent(xml, "prfcast").replace(/\s*등\s*$/, "") },
      { label: "관람연령", value: getTagContent(xml, "prfage") },
      { label: "공연시간", value: getTagContent(xml, "dtguidance") },
      { label: "티켓", value: getTagContent(xml, "pcseguidance") },
    ]
      .filter(({ value }) => value)
      .map(({ label, value }) => `${label}: ${value}`);

    return parts.length > 0 ? { ...item, description: parts.join("\n") } : item;
  } catch {
    return item;
  }
};

export const getKopisSchedules = async (): Promise<ScheduleItem[]> => {
  const apiKey = process.env.KOPIS_API_KEY;
  if (!apiKey) return [];

  const results = await Promise.allSettled(
    ["아이브", "IVE"].flatMap((keyword) => [0, 1, 2].map((windowIndex) => searchKopis(apiKey, keyword, windowIndex)))
  );
  const items = results.flatMap((result) => (result.status === "fulfilled" ? result.value : []));

  //두 검색어에서 같은 공연이 중복될 수 있어 공연 ID로 제거
  const byId = new Map(items.map((item) => [item.id, item]));
  return Promise.all([...byId.values()].map((item) => withDetail(apiKey, item)));
};
