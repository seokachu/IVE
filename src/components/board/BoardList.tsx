import BoardListItem from "./BoardListItem";
import { useMembershipTiers } from "@/hooks/queries/useMembership";
import type { BoardListProps } from "@/types/board";

const BoardList = ({ boards, keyword }: BoardListProps) => {
  //작성자 멤버십 티어 일괄 조회 — 구독자 뱃지·아바타 링 표시용
  const { data: tiers } = useMembershipTiers(boards?.data?.map((item) => item.user_id ?? "") ?? []);

  //마지막(또는 단일) 행도 하단 보더로 마감 — divide-y는 행 사이에만 그려짐
  return (
    <ul data-testid="board-list" className="divide-y divide-gray-200 border-b border-gray-200">
      {boards?.data?.map((item) => (
        <BoardListItem
          key={item.id}
          item={item}
          keyword={keyword}
          membershipTier={item.user_id ? (tiers?.[item.user_id] ?? "free") : "free"}
        />
      ))}
    </ul>
  );
};

export default BoardList;
