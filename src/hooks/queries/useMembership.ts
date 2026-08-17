import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getEffectiveTier,
  getMembershipTiers,
  getMyMembership,
  isCancelScheduled,
  isMembershipBenefitActive,
} from "@/lib/supabase/membership";
import { useSession } from "@/store/zustand";

//내 멤버십 구독 정보 — 테이블 미생성·미구독이면 null(무료)
export const useMyMembership = () => {
  const session = useSession();
  const userId = session?.user?.id;

  const query = useQuery({
    queryKey: ["membership", userId],
    queryFn: () => getMyMembership(userId!),
    enabled: !!userId,
  });

  return {
    ...query,
    membership: query.data ?? null,
    tier: getEffectiveTier(query.data ?? null),
    isBenefitActive: isMembershipBenefitActive(query.data ?? null),
    isCancelScheduled: isCancelScheduled(query.data ?? null),
  };
};

//커뮤니티 뱃지용 — 작성자 목록의 티어 맵 { userId: tier }
export const useMembershipTiers = (userIds: string[]) => {
  const uniqueIds = [...new Set(userIds.filter(Boolean))].sort();

  return useQuery({
    queryKey: ["membership", "tiers", uniqueIds],
    queryFn: () => getMembershipTiers(uniqueIds),
    enabled: uniqueIds.length > 0,
    staleTime: 1000 * 60 * 5,
  });
};

//단일 유저 티어 — 댓글처럼 리스트 컨텍스트가 없는 곳용 (같은 유저는 쿼리 키로 dedupe)
export const useMembershipTier = (userId?: string | null) => {
  const { data } = useMembershipTiers(userId ? [userId] : []);
  return userId ? (data?.[userId] ?? "free") : "free";
};

//구독 상태 변경 후 캐시 갱신
export const useInvalidateMembership = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["membership"] });
};
