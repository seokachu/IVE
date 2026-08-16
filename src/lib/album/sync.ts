import type { TablesInsert } from "@/types/supabase";

//iTunes 아티스트 룩업으로 아이브 발매 목록 조회 (앨범 자동 등록·디스코그래피 공용)
const IVE_ITUNES_ARTIST_ID = 1594159996;
const ITUNES_LOOKUP_URL = "https://itunes.apple.com/lookup";
//발매반 기준: 4곡 이상(정규·미니/EP) — 1~2곡 디지털 싱글·리믹스는 캐러셀 자동 등록에서 제외
const MIN_TRACK_COUNT = 4;

interface ItunesAlbum {
  wrapperType: string;
  collectionName?: string;
  collectionViewUrl?: string;
  artworkUrl100?: string;
  releaseDate?: string;
  trackCount?: number;
  primaryGenreName?: string;
}

export interface DiscographyItem {
  id: string;
  title: string;
  image: string | null;
  releaseDate: string;
  trackCount: number;
  category: "정규" | "미니" | "싱글";
  appleLink: string | null;
}

export const normalizeAlbumTitle = (title: string) =>
  title
    .replace(/\s*-\s*(EP|Single)\s*$/i, "")
    .replace(/[^\p{L}\p{N}]/gu, "")
    .toLowerCase();

const stripTitle = (title: string) => title.replace(/\s*-\s*(EP|Single)\s*$/i, "");

const toDotDate = (isoDate: string) => {
  const date = new Date(isoDate);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
};

const categoryOf = (trackCount: number): DiscographyItem["category"] =>
  trackCount >= 10 ? "정규" : trackCount >= MIN_TRACK_COUNT ? "미니" : "싱글";

//전체 발매 목록 (중복 제거 · 발매일 내림차순) — revalidate 값으로 캐싱 제어
export const fetchItunesReleases = async (revalidateSeconds: number | null = 86400): Promise<DiscographyItem[]> => {
  const params = new URLSearchParams({
    id: String(IVE_ITUNES_ARTIST_ID),
    entity: "album",
    country: "KR",
    limit: "200",
  });
  const res = await fetch(`${ITUNES_LOOKUP_URL}?${params}`, {
    ...(revalidateSeconds === null ? { cache: "no-store" as const } : { next: { revalidate: revalidateSeconds } }),
  });
  if (!res.ok) throw new Error(`iTunes 아티스트 조회 실패 (${res.status})`);
  const data: { results: ItunesAlbum[] } = await res.json();

  const seen = new Set<string>();
  return data.results
    .filter(
      (result) => result.wrapperType === "collection" && result.collectionName && result.releaseDate
    )
    .filter((result) => {
      const key = normalizeAlbumTitle(result.collectionName!);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((album) => ({
      id: `itunes-${normalizeAlbumTitle(album.collectionName!)}`,
      title: stripTitle(album.collectionName!),
      image: album.artworkUrl100?.replace("100x100", "600x600") || null,
      releaseDate: album.releaseDate!,
      trackCount: album.trackCount || 0,
      category: categoryOf(album.trackCount || 0),
      appleLink: album.collectionViewUrl || null,
    }))
    .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
};

//캐러셀 자동 등록용: 발매반(정규·미니)만 album 테이블 Insert 형태로 변환
export const fetchItunesAlbums = async (): Promise<TablesInsert<"album">[]> => {
  const releases = await fetchItunesReleases(null);
  return releases
    .filter((release) => release.trackCount >= MIN_TRACK_COUNT)
    .map((release) => ({
      title: release.title,
      album_image: release.image,
      album_info: release.category,
      date: toDotDate(release.releaseDate),
      genre: "K-POP",
      total_song: release.trackCount,
      apple_link: release.appleLink,
    }));
};
