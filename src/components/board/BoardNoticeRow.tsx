"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { BOARD_NOTICE } from "@/utils/constants";
import { cn } from "@/utils/utils";

//리스트 최상단 고정 공지 로우 — 클릭하면 이용 규칙 본문이 펼쳐진다
const BoardNoticeRow = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg bg-purple-50 mb-3">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center gap-2.5 px-4 py-3 text-left"
      >
        <span className="shrink-0 px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-500 dark:text-purple-300">
          공지
        </span>
        <p className="flex-1 min-w-0 truncate text-sm font-semibold">{BOARD_NOTICE.title}</p>
        <ChevronDown
          className={cn("w-4 h-4 shrink-0 text-gray-400 transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1">
          <ul className="flex flex-col gap-3">
            {BOARD_NOTICE.rules.map((rule, index) => (
              <li key={rule.heading} className="flex gap-2.5">
                <span className="shrink-0 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 text-[11px] font-bold text-purple-500 dark:text-purple-300">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{rule.heading}</p>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-gray-500">{rule.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[13px] text-gray-500">{BOARD_NOTICE.footer}</p>
        </div>
      )}
    </div>
  );
};

export default BoardNoticeRow;
