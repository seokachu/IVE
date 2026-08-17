import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  className?: string;
  quantity: number;
  increase: () => void;
  decrease: () => void;
}

// 상세 페이지(ProductInfo)와 동일한 필 스테퍼 — 시안 기준 카드 내 소형 사이즈
const QuantitySelector = ({ className = "", quantity, increase, decrease }: QuantitySelectorProps) => {
  return (
    <div className={`flex w-fit items-center rounded-full border border-gray-300 ${className}`}>
      <Button
        variant="plain"
        size="auto"
        onClick={decrease}
        disabled={quantity === 1}
        className="flex h-8 w-8 items-center justify-center text-gray-400 disabled:opacity-40"
        aria-label="수량 감소"
      >
        <Minus size={13} />
      </Button>
      <span className="w-7 text-center text-[13px] font-bold">{quantity}</span>
      <Button
        variant="plain"
        size="auto"
        onClick={increase}
        className="flex h-8 w-8 items-center justify-center"
        aria-label="수량 증가"
      >
        <Plus size={13} />
      </Button>
    </div>
  );
};

export default QuantitySelector;
