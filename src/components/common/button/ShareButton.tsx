"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ShareSheet from "@/components/common/ShareSheet";
import { Share2 } from "lucide-react";
import { ButtonHTMLAttributes } from "react";
interface classNameProps {
  className?: ButtonHTMLAttributes<HTMLButtonElement>["className"];
  iconSize?: number;
}

//시안 기준: 클릭 시 바로 복사 대신 공유 시트(카카오톡·링크 복사·더보기) 오픈
const ShareButton = ({ className, iconSize = 25 }: classNameProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <>
      <Button
        variant="plain"
        size="auto"
        onClick={() => setIsSheetOpen(true)}
        className={className}
        aria-label="현재 페이지 공유하기"
      >
        <Share2 size={iconSize} />
      </Button>
      {isSheetOpen && <ShareSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} />}
    </>
  );
};

export default ShareButton;
