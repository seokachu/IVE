"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
const GoTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY >= 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const onClickToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <Button
      variant="plain"
      size="auto"
      onClick={onClickToTop}
      aria-label="최상단으로 이동"
      className="fixed bottom-6 mb-tabbar right-6 z-50 flex w-11 h-11 items-center justify-center rounded-full bg-purple text-white shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-colors hover:bg-purple-400"
    >
      <ChevronUp className="w-5 h-5" />
    </Button>
  );
};

export default GoTopButton;
