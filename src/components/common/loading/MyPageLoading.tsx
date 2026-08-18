import { Skeleton } from "@/components/ui/skeleton";

interface MyPageLoadingProps {
  title?: string;
  variant?: "list" | "grid";
}

//마이페이지 공통 로딩 — 스피너 대신 실제 콘텐츠 골격(리스트 행·카드 그리드)을 흉내 낸 스켈레톤으로 다른 페이지 로딩과 톤 통일
const MyPageLoading = ({ title, variant = "list" }: MyPageLoadingProps) => {
  return (
    <div>
      {title ? (
        <h2 className="mb-5 text-[22px] font-bold leading-tight">{title}</h2>
      ) : (
        <Skeleton className="mb-5 h-7 w-32" />
      )}
      {variant === "grid" ? (
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <li key={index} className="flex flex-col gap-2.5">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-2/5" />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <li key={index} className="flex items-center gap-4 rounded-lg border border-gray-200 p-4">
              <Skeleton className="h-20 w-20 shrink-0 rounded-md" />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Skeleton className="h-5 w-3/5 max-w-64" />
                <Skeleton className="h-4 w-2/5 max-w-40" />
                <Skeleton className="h-4 w-1/4 max-w-24" />
              </div>
              <Skeleton className="hidden h-9 w-24 shrink-0 rounded-full sm:block" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyPageLoading;
