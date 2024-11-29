import { CiSquarePlus } from "react-icons/ci";
import { CiSquareMinus } from "react-icons/ci";

interface QuantitySelectorProps {
  className: string;
  quantity: number;
  increase: () => void;
  decrease: () => void;
}

const QuantitySelector = ({
  className,
  quantity,
  increase,
  decrease,
}: QuantitySelectorProps) => {
  return (
    <div className="flex items-center text-sm">
      <h3 className={className}>수량</h3>
      <div className="flex gap-2 items-center">
        <button
          onClick={decrease}
          disabled={quantity === 1}
          className={`${
            quantity === 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:text-purple"
          }`}
        >
          <CiSquareMinus size={25} />
        </button>
        <p>{quantity}</p>
        <button
          onClick={increase}
          className={`${quantity >= 5 ? "opacity-50 " : "hover:text-purple"}`}
        >
          <CiSquarePlus size={25} />
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;
