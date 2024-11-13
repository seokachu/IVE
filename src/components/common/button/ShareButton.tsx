"use client";
import { classNameProps } from "@/types";
import { IoMdShare } from "react-icons/io";
import { useToast } from "@/hooks/use-toast";

const ShareButton = ({ className }: classNameProps) => {
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
    <button onClick={onClickShare} className={className}>
      <IoMdShare size={25} />
    </button>
  );
};

export default ShareButton;
