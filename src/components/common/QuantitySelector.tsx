import { Button } from "@/components/ui/button";
import { SquareMinus, SquarePlus } from "lucide-react";
interface QuantitySelectorProps {
  className: string;
  quantity: number;
  increase: () => void;
  decrease: () => void;
}

const QuantitySelector = ({ className, quantity, increase, decrease }: QuantitySelectorProps) => {
  return (
    <div className="flex items-center text-sm">
      <h3 className={className}>수량</h3>
      <div className="flex gap-2 items-center">
        <Button variant="plain" size="auto"
          onClick={decrease}
          disabled={quantity === 1}
          className={`${quantity === 1 ? "opacity-50 cursor-not-allowed" : "hover:text-purple"}`}
          aria-label="수량 감소"
        >
          <SquareMinus size={25} />
        </Button>
        <p>{quantity}</p>
        <Button variant="plain" size="auto"
          onClick={increase}
          className={`${quantity >= 5 ? "opacity-50 " : "hover:text-purple"}`}
          aria-label="수량 증가"
        >
          <SquarePlus size={25} />
        </Button>
      </div>
    </div>
  );
};

export default QuantitySelector;
