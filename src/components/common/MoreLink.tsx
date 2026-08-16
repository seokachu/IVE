import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface MoreLinkProps {
  href: string;
  label?: string;
}

//섹션 우측 상단 "전체 보기 →" 공통 링크
const MoreLink = ({ href, label = "전체 보기" }: MoreLinkProps) => {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-sm font-semibold text-purple-500 dark:text-purple-300 hover:opacity-80 transition-opacity"
    >
      {label}
      <ArrowRight className="w-4 h-4" />
    </Link>
  );
};

export default MoreLink;
