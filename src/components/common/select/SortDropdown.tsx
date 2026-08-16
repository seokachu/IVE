"use client";
import { Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface SortDropdownOption {
  value: string;
  label: string;
}

interface SortDropdownProps {
  options: readonly SortDropdownOption[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
}

//정렬 셀렉트 공통 컴포넌트 — 라운드 필 트리거 + 체크 표시 메뉴 (자유게시판·굿즈샵 공용)
const SortDropdown = ({
  options,
  value,
  onChange,
  ariaLabel = "정렬 기준 선택",
}: SortDropdownProps) => {
  const currentLabel =
    options.find((option) => option.value === value)?.label ?? options[0]?.label;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="shrink-0 flex items-center gap-1.5 h-10 px-4 rounded-full border border-gray-200 bg-card text-[13px] font-semibold hover:bg-gray-50 transition-colors"
        aria-label={ariaLabel}
      >
        {currentLabel}
        <ChevronDown className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[140px] rounded-[14px] border-gray-200 shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-1.5"
      >
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`gap-2.5 rounded-lg px-3 py-2.5 text-sm ${
              option.value === value
                ? "font-bold text-purple-500 dark:text-purple-300"
                : ""
            }`}
          >
            <Check
              size={15}
              className={option.value === value ? "" : "invisible"}
              aria-hidden="true"
            />
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortDropdown;
