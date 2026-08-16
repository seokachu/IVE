import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { AdjacentBoard, AdjacentBoards } from "@/types/board";

const NavRow = ({
  board,
  label,
  icon,
  hasBorder,
}: {
  board: AdjacentBoard;
  label: string;
  icon: React.ReactNode;
  hasBorder: boolean;
}) => (
  <Link
    href={`/board/${board.id}`}
    className={`flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors ${
      hasBorder ? "border-b border-gray-200" : ""
    }`}
  >
    <span className="shrink-0 text-gray-400">{icon}</span>
    <span className="shrink-0 text-xs font-semibold text-gray-400">{label}</span>
    <p className="flex-1 min-w-0 truncate text-sm">{board.title}</p>
  </Link>
);

//이전(더 최신)/다음(더 오래된) 글 내비 — 목록 복귀 없이 순환하는 회유 동선
const BoardPrevNextNav = ({ adjacent }: { adjacent?: AdjacentBoards }) => {
  if (!adjacent || (!adjacent.prev && !adjacent.next)) return null;

  return (
    <nav className="border border-gray-200 rounded-lg overflow-hidden" aria-label="이전 다음 글">
      {adjacent.prev && (
        <NavRow
          board={adjacent.prev}
          label="이전 글"
          icon={<ChevronUp size={14} />}
          hasBorder={!!adjacent.next}
        />
      )}
      {adjacent.next && (
        <NavRow
          board={adjacent.next}
          label="다음 글"
          icon={<ChevronDown size={14} />}
          hasBorder={false}
        />
      )}
    </nav>
  );
};

export default BoardPrevNextNav;
