"use client";
import MyPageLoading from "@/components/common/loading/MyPageLoading";
import MembershipManage from "@/components/mypage/membership/MembershipManage";
import MembershipPlans from "@/components/mypage/membership/MembershipPlans";
import { useMyMembership } from "@/hooks/queries/useMembership";

//멤버십 — 혜택 유지 중이면 관리 화면, 아니면 플랜 선택 화면
const MembershipPage = () => {
  const { membership, isBenefitActive, isLoading } = useMyMembership();

  if (isLoading) return <MyPageLoading title="멤버십" />;

  return isBenefitActive && membership ? <MembershipManage membership={membership} /> : <MembershipPlans />;
};

export default MembershipPage;
