import type { LucideIcon } from "lucide-react";

interface MyPageEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: React.ReactNode;
}

//마이페이지 빈 상태 — 64px 아이콘 서클 + 타이틀·설명 + 액션 슬롯 (.pen "마이페이지 · 빈 상태", 사이트 공통 규격)
const MyPageEmptyState = ({ icon: Icon, title, description, children }: MyPageEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-gray-200 px-5 py-16">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-50" aria-hidden="true">
        <Icon size={26} className="text-purple-400" />
      </span>
      <h3 className="mt-1 text-[15px] font-semibold">{title}</h3>
      <p className="text-[13px] text-gray-400">{description}</p>
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
};

export default MyPageEmptyState;
