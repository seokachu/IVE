"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  //SSR과 클라이언트 테마 불일치로 인한 hydration 오류 방지
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Button
      variant="plain"
      size="auto"
      onClick={() => {
        //전환 순간에만 전역 트랜지션 활성화 — 평소 hover 등에는 영향 없음
        document.documentElement.classList.add("theme-transition");
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
        window.setTimeout(() => document.documentElement.classList.remove("theme-transition"), 400);
      }}
      className="w-6 h-6"
      aria-label={resolvedTheme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
    >
      {mounted && (resolvedTheme === "dark" ? <Sun size={20} /> : <Moon size={20} />)}
    </Button>
  );
};

export default ThemeToggle;
