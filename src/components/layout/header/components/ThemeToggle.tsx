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
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="w-6 h-6"
      aria-label={resolvedTheme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
    >
      {mounted && (resolvedTheme === "dark" ? <Sun size={20} /> : <Moon size={20} />)}
    </Button>
  );
};

export default ThemeToggle;
