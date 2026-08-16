import type { AlbumTrack } from "@/types/main";

//iTunes Search API — 키 불필요, 수록곡 목록과 30초 미리듣기 음원 제공
const ITUNES_SEARCH_URL = "https://itunes.apple.com/search";
//앨범 정보는 거의 안 바뀌므로 일주일 캐싱
const ITUNES_REVALIDATE_SECONDS = 604800;

interface ItunesCollection {
  wrapperType: string;
  collectionId: number;
  collectionName: string;
  artistName: string;
}

interface ItunesTrack {
  wrapperType: string;
  collectionId?: number;
  trackNumber?: number;
  trackName?: string;
  previewUrl?: string;
  trackTimeMillis?: number;
}

//"I'VE MINE - EP" → "ivemine" 처럼 정규화해서 제목 비교
const normalize = (title: string) =>
  title
    .replace(/\s*-\s*(EP|Single)\s*$/i, "")
    .replace(/[^\p{L}\p{N}]/gu, "")
    .toLowerCase();

export const getAlbumTracks = async (albumTitle: string): Promise<AlbumTrack[]> => {
  const searchParams = new URLSearchParams({
    term: `아이브 ${albumTitle}`,
    entity: "album",
    country: "KR",
    limit: "10",
  });
  const searchRes = await fetch(`${ITUNES_SEARCH_URL}?${searchParams}`, {
    next: { revalidate: ITUNES_REVALIDATE_SECONDS },
  });
  if (!searchRes.ok) throw new Error(`iTunes 검색 실패 (${searchRes.status})`);
  const searchData: { results: ItunesCollection[] } = await searchRes.json();

  const target = normalize(albumTitle);
  const collection = searchData.results.filter(
    (result) => result.wrapperType === "collection" && /아이브|IVE/i.test(result.artistName)
  );
  const matched =
    collection.find((result) => normalize(result.collectionName) === target) ||
    collection.find(
      (result) => normalize(result.collectionName).includes(target) || target.includes(normalize(result.collectionName))
    );
  if (!matched) return [];

  //lookup API가 곡을 안 주는 경우가 있어 앨범명 기준 곡 검색 후 collectionId로 필터
  const songParams = new URLSearchParams({
    term: matched.collectionName.replace(/\s*-\s*(EP|Single)\s*$/i, ""),
    attribute: "albumTerm",
    entity: "song",
    country: "KR",
    limit: "50",
  });
  const songRes = await fetch(`${ITUNES_SEARCH_URL}?${songParams}`, {
    next: { revalidate: ITUNES_REVALIDATE_SECONDS },
  });
  if (!songRes.ok) throw new Error(`iTunes 곡 검색 실패 (${songRes.status})`);
  const songData: { results: ItunesTrack[] } = await songRes.json();

  return songData.results
    .filter((result) => result.collectionId === matched.collectionId && result.trackName)
    .map((track) => ({
      trackNumber: track.trackNumber || 0,
      name: track.trackName!,
      previewUrl: track.previewUrl || null,
      durationMs: track.trackTimeMillis || null,
    }))
    .sort((a, b) => a.trackNumber - b.trackNumber);
};
