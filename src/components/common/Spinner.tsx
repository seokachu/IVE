import { LoaderCircle } from "lucide-react";
import { cn } from "@/utils/utils";

interface SpinnerProps {
  size?: number;
  className?: string;
}

//react-spinners 대체 — 로딩 표시는 이 컴포넌트 하나만 사용 (docs/design-system.md)
const Spinner = ({ size = 36, className }: SpinnerProps) => (
  <LoaderCircle size={size} className={cn("animate-spin text-purple-400", className)} role="status" aria-label="로딩 중" />
);

export default Spinner;
