interface MyPageTitleProps {
  title: string;
  count?: number;
  children?: React.ReactNode;
}

//마이페이지 콘텐츠 헤드 — 타이틀 + 퍼플 카운트 + 우측 액션 슬롯 (.pen 시안의 ContentHead)
const MyPageTitle = ({ title, count, children }: MyPageTitleProps) => {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <h2 className="flex items-baseline gap-2 text-[22px] font-bold leading-tight">
        {title}
        {count !== undefined && <span className="text-base font-bold text-purple-400">{count}</span>}
      </h2>
      {children}
    </div>
  );
};

export default MyPageTitle;
