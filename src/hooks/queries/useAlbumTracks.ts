import { queryOptions, useQuery } from "@tanstack/react-query";
import type { AlbumTrack } from "@/types/main";

//훅 밖(queryClient.fetchQuery)에서도 같은 캐시를 쓰도록 옵션 분리 — 카드 호버 미리듣기가 사용
export const albumTracksQueryOptions = (albumTitle: string) =>
  queryOptions<AlbumTrack[]>({
    queryKey: ["albumTracks", albumTitle],
    queryFn: async () => {
      const res = await fetch(`/api/album/tracks?title=${encodeURIComponent(albumTitle)}`);
      if (!res.ok) throw new Error("수록곡을 가져오는데 실패했습니다.");
      return res.json();
    },
    staleTime: Infinity,
  });

//앨범 수록곡 + 미리듣기 가져오기 (패널을 열 때만 요청)
export const useAlbumTracks = (albumTitle: string) => {
  return useQuery(albumTracksQueryOptions(albumTitle));
};
