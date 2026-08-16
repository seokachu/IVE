import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface BoardEmptyStateProps {
  Icon: LucideIcon;
  title: string;
  description?: string;
  //purple: 안내·행동 유도, gray: 검색 결과 없음 등 중립
  tone?: "purple" | "gray";
  action?: ReactNode;
}

//시안 기준: 게시판 빈 상태 — 파스텔 아이콘 서클 + 타이틀 + 서브 + 선택 CTA
const BoardEmptyState = ({ Icon, title, description, tone = "purple", action }: BoardEmptyStateProps) => {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl bg-gray-50 px-6 py-14 text-center">
      <span
        aria-hidden
        className={`flex h-16 w-16 items-center justify-center rounded-full ${
          tone === "purple" ? "bg-purple-50 text-purple-500" : "bg-gray-100 text-gray-500"
        }`}
      >
        <Icon size={26} />
      </span>
      <p className="mt-5 text-base font-bold">{title}</p>
      {description && <p className="mt-1.5 text-xs text-gray-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export default BoardEmptyState;
