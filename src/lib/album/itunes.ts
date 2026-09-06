import type { AlbumTrack } from "@/types/main";

//iTunes Search API — 키 불필요, 수록곡 목록과 30초 미리듣기 음원 제공
const ITUNES_SEARCH_URL = "https://itunes.apple.com/search";
const ITUNES_LOOKUP_URL = "https://itunes.apple.com/lookup";
const IVE_ITUNES_ARTIST_ID = "1594159996";
//KR 스토어프론트 검색이 통째로 빈 결과를 돌려주는 날이 있다(2026-09-07 확인: NewJeans 도 0건, US 는 정상).
//앨범 ID · 미리듣기 URL 은 스토어프론트와 무관하므로 KR → US 순으로 시도해 처음 비어 있지 않은 결과를 쓴다.
const STOREFRONTS = ["KR", "US"];
//앨범 정보는 거의 안 바뀌지만 빈 응답이 오래 눌러앉지 않게 한 시간만 — 결과가 있을 때의 장기 캐시는 라우트(CDN)가 맡는다
const ITUNES_REVALIDATE_SECONDS = 3600;

interface ItunesCollection {
  wrapperType: string;
  collectionId: number;
  collectionName: string;
  artistName: string;
  trackCount?: number;
}

interface ItunesTrack {
  wrapperType: string;
  collectionId?: number;
  collectionName?: string;
  trackNumber?: number;
  trackName?: string;
  previewUrl?: string;
  trackTimeMillis?: number;
}

const stripSuffix = (title: string) => title.replace(/\s*-\s*(EP|Single)\s*$/i, "");

//"I'VE MINE - EP" → "ivemine" 처럼 정규화해서 제목 비교
const normalize = (title: string) =>
  stripSuffix(title)
    .replace(/[^\p{L}\p{N}]/gu, "")
    .toLowerCase();

const fetchItunes = async <T>(url: string, params: Record<string, string>): Promise<T[]> => {
  const res = await fetch(`${url}?${new URLSearchParams(params)}`, {
    next: { revalidate: ITUNES_REVALIDATE_SECONDS },
  });
  if (!res.ok) throw new Error(`iTunes 요청 실패 (${res.status})`);
  const data: { results?: T[] } = await res.json();
  return data.results ?? [];
};

//스토어프론트를 바꿔 가며 처음 비어 있지 않은 결과를 돌려준다. 앞 스토어프론트의 요청 오류는 다음으로 넘기고, 전부 실패하면 마지막 오류를 던진다
const firstNonEmpty = async <T>(load: (country: string) => Promise<T[]>): Promise<T[]> => {
  let lastError: unknown = null;
  for (const country of STOREFRONTS) {
    try {
      const results = await load(country);
      if (results.length > 0) return results;
    } catch (error) {
      lastError = error;
    }
  }
  if (lastError) throw lastError;
  return [];
};

const isIveCollection = (result: ItunesCollection) =>
  result.wrapperType === "collection" && /아이브|IVE/i.test(result.artistName);

//아이브 싱글(1~2곡 컬렉션) 곡명 목록 — 타이틀/활동곡 판별용 (싱글로도 발매된 곡 = 활동곡 관행)
const getSingleTrackNames = async (): Promise<Set<string>> => {
  try {
    const albums = await firstNonEmpty((country) =>
      fetchItunes<ItunesCollection>(ITUNES_LOOKUP_URL, { id: IVE_ITUNES_ARTIST_ID, entity: "album", country, limit: "200" }),
    );
    return new Set(
      albums
        .filter((result) => result.wrapperType === "collection" && (result.trackCount || 0) <= 2)
        .map((result) => normalize(result.collectionName)),
    );
  } catch {
    return new Set();
  }
};

//앨범 컬렉션 찾기 — ① 아티스트 발매 목록(lookup): 디스코그래피 목록과 같은 출처라 제목이 정확히 맞고 KR 검색 장애와 무관 ② 제목 검색: 룩업에 없는 리믹스 · 컴필레이션
const findAlbum = async (albumTitle: string): Promise<ItunesCollection | null> => {
  const target = normalize(albumTitle);
  const pickMatch = (results: ItunesCollection[]) => {
    const collections = results.filter(isIveCollection);
    const matched =
      collections.find((result) => normalize(result.collectionName) === target) ||
      collections.find(
        (result) => normalize(result.collectionName).includes(target) || target.includes(normalize(result.collectionName)),
      );
    return matched ? [matched] : [];
  };

  const [fromLookup] = await firstNonEmpty((country) =>
    fetchItunes<ItunesCollection>(ITUNES_LOOKUP_URL, { id: IVE_ITUNES_ARTIST_ID, entity: "album", country, limit: "200" }).then(pickMatch),
  );
  if (fromLookup) return fromLookup;

  const [fromSearch] = await firstNonEmpty((country) =>
    fetchItunes<ItunesCollection>(ITUNES_SEARCH_URL, { term: `아이브 ${albumTitle}`, entity: "album", country, limit: "10" }).then(pickMatch),
  );
  return fromSearch ?? null;
};

//lookup API 는 컬렉션의 곡을 돌려주지 않는다(스토어프론트 무관) — 앨범명 기준 곡 검색 후 컬렉션으로 걸러 낸다
const findTracks = async (album: ItunesCollection): Promise<ItunesTrack[]> => {
  const albumKey = normalize(album.collectionName);
  return firstNonEmpty((country) =>
    fetchItunes<ItunesTrack>(ITUNES_SEARCH_URL, {
      term: `아이브 ${stripSuffix(album.collectionName)}`,
      attribute: "albumTerm",
      entity: "song",
      country,
      limit: "50",
    }).then((results) => {
      const tracks = results.filter((result) => result.wrapperType === "track" && result.trackName);
      const byId = tracks.filter((track) => track.collectionId === album.collectionId);
      if (byId.length > 0) return byId;
      //스토어프론트에 따라 컬렉션 ID 가 다른 경우 — 앨범명으로 맞춘다
      return tracks.filter((track) => track.collectionName && normalize(track.collectionName) === albumKey);
    }),
  );
};

export const getAlbumTracks = async (albumTitle: string): Promise<AlbumTrack[]> => {
  const album = await findAlbum(albumTitle);
  if (!album) return [];

  const target = normalize(albumTitle);
  const [tracks, singleNames] = await Promise.all([findTracks(album), getSingleTrackNames()]);

  return tracks
    .map((track) => ({
      trackNumber: track.trackNumber || 0,
      name: track.trackName!,
      previewUrl: track.previewUrl || null,
      durationMs: track.trackTimeMillis || null,
      //싱글로도 발매된 곡이거나 앨범명과 같은 곡이면 타이틀/활동곡으로 표시
      isTitle: singleNames.has(normalize(track.trackName!)) || normalize(track.trackName!) === target,
    }))
    .sort((a, b) => a.trackNumber - b.trackNumber);
};
