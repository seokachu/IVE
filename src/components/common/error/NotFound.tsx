"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MessageSquare, Music, Newspaper, ShoppingBag, Unlink } from "lucide-react";
import { Button } from "@/components/ui/button";

const QUICK_LINKS = [
  { label: "음악", path: "/discography", Icon: Music },
  { label: "소식", path: "/news", Icon: Newspaper },
  { label: "게시판", path: "/board", Icon: MessageSquare },
  { label: "굿즈샵", path: "/shop", Icon: ShoppingBag },
];

//404 화면 — 그라데이션 넘버럴 + 끊긴 경로 칩 + 2단 CTA + 퀵링크 (.pen "404 · 라이트/다크")
const NotFound = () => {
  const pathname = usePathname();
  const { back } = useRouter();

  return (
    <main className="flex min-h-[640px] flex-col items-center justify-center px-5 py-20 text-center">
      <p
        className="bg-gradient-to-br from-purple-400 to-orange-300 bg-clip-text text-[80px] font-bold leading-none tracking-[-0.04em] text-transparent lg:text-[112px]"
        aria-hidden
      >
        404
      </p>
      <h1 className="mt-[18px] text-xl font-bold lg:text-[26px]">페이지를 찾을 수 없어요</h1>
      <p className="mt-2.5 text-sm text-gray-500 lg:text-[15px]">
        요청하신 주소가 변경되었거나 삭제되었어요.
      </p>

      <span className="mt-[22px] flex max-w-full items-center gap-2 rounded-full bg-gray-100 px-4 py-2">
        <Unlink size={14} className="shrink-0 text-gray-400" aria-hidden />
        <span className="truncate text-[13px] text-gray-400 line-through">{pathname}</span>
      </span>

      <div className="mt-[30px] flex flex-col gap-2.5 sm:flex-row">
        <Button
          asChild
          variant="plain"
          size="auto"
          className="h-12 w-[180px] rounded-lg bg-purple-300 text-base text-white transition-colors hover:bg-purple-400"
        >
          <Link href="/">메인으로 가기</Link>
        </Button>
        <Button onClick={back} variant="outlineBrand" size="auto" className="h-12 w-[180px] rounded-lg text-base">
          이전 페이지로
        </Button>
      </div>

      <div className="mt-10 flex w-full max-w-[440px] items-center gap-3">
        <span className="h-px flex-1 bg-gray-200" />
        <span className="shrink-0 text-xs text-gray-400">이런 페이지는 어때요?</span>
        <span className="h-px flex-1 bg-gray-200" />
      </div>

      <nav className="mt-4 flex flex-wrap justify-center gap-2">
        {QUICK_LINKS.map(({ label, path, Icon }) => (
          <Link
            key={path}
            href={path}
            className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-card px-3.5 py-2 text-[13px] font-semibold text-gray-500 transition-colors hover:border-purple-200 hover:text-purple-500"
          >
            <Icon size={14} aria-hidden />
            {label}
          </Link>
        ))}
      </nav>
    </main>
  );
};

export default NotFound;
