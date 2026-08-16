"use client";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ButtonHTMLAttributes } from "react";
interface classNameProps {
  className?: ButtonHTMLAttributes<HTMLButtonElement>["className"];
  iconSize?: number;
}

const ShareButton = ({ className, iconSize = 25 }: classNameProps) => {
  const { toast } = useToast();

  const onClickShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "링크가 복사되었습니다.",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "링크 복사에 실패했습니다.",
        });
      }
    }
  };

  return (
    <Button variant="plain" size="auto" onClick={onClickShare} className={className} aria-label="현재 페이지 공유하기">
      <Share2 size={iconSize} />
    </Button>
  );
};

export default ShareButton;
