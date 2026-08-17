import { supabase } from "@/lib/supabase/client";
import type { MembershipRow, MembershipTier } from "@/types/mypage";

//클라이언트에 내려도 되는 컬럼만 — billing_key·customer_key는 서버(API 라우트) 전용
const SAFE_COLUMNS =
  "id, user_id, tier, status, price, card_company, card_number, pending_tier, started_at, next_billing_at, canceled_at, created_at";

//내 멤버십 조회 — 행이 없거나 테이블 미생성이면 null(무료 회원)로 폴백
export const getMyMembership = async (userId: string): Promise<MembershipRow | null> => {
  const { data, error } = await supabase.from("memberships").select(SAFE_COLUMNS).eq("user_id", userId).maybeSingle();

  if (error) return null;
  return data as MembershipRow | null;
};

//혜택 유지 여부 — active이거나, 해지했더라도 다음 결제일 전이면 혜택 유지
export const isMembershipBenefitActive = (membership: MembershipRow | null): boolean => {
  if (!membership) return false;
  if (membership.status === "active") return true;
  return new Date(membership.next_billing_at).getTime() > Date.now();
};

//혜택 기준 현재 티어
export const getEffectiveTier = (membership: MembershipRow | null): MembershipTier => {
  return isMembershipBenefitActive(membership) ? membership!.tier : "free";
};

//멤버십 상시 할인율 — DIVE+ 5%, VIP 10% (결제 금액에 적용)
export const MEMBERSHIP_DISCOUNT_RATES: Record<MembershipTier, number> = {
  free: 0,
  plus: 0.05,
  vip: 0.1,
};

export const getMembershipDiscount = (tier: MembershipTier, amount: number): number => {
  return Math.floor(amount * MEMBERSHIP_DISCOUNT_RATES[tier]);
};

//커뮤니티 뱃지용 — 작성자 유저 id 목록의 티어를 한 번에 조회 (memberships_public 뷰)
export const getMembershipTiers = async (userIds: string[]): Promise<Record<string, MembershipTier>> => {
  if (userIds.length === 0) return {};

  const { data, error } = await supabase.from("memberships_public").select("user_id, tier").in("user_id", userIds);

  if (error) return {};
  return Object.fromEntries((data || []).map((row) => [row.user_id, row.tier as MembershipTier]));
};
