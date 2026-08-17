import { Check, ChevronRight } from "lucide-react";

const STEPS = ["장바구니", "주문·결제", "주문완료"] as const;

interface CheckoutStepsProps {
  /** 현재 단계 (1=장바구니, 2=주문·결제, 3=주문완료) */
  current: 1 | 2 | 3;
}

const CheckoutSteps = ({ current }: CheckoutStepsProps) => {
  return (
    <ol className="flex items-center gap-2.5">
      {STEPS.map((label, index) => {
        const step = index + 1;
        const isActive = step === current;
        const isDone = step < current;

        return (
          <li key={label} className="flex items-center gap-2.5">
            {index > 0 && <ChevronRight size={14} className="text-gray-300" aria-hidden />}
            <span className="flex items-center gap-1.5">
              <span
                className={`flex h-[22px] w-[22px] items-center justify-center rounded-full text-[11px] font-bold ${
                  isActive
                    ? "bg-purple-300 text-white"
                    : isDone
                      ? "bg-purple-50 text-purple-400"
                      : "bg-gray-100 text-gray-400"
                }`}
                aria-hidden
              >
                {isDone ? <Check size={12} /> : `0${step}`}
              </span>
              <span className={`text-[13px] ${isActive ? "font-semibold" : "text-gray-400"}`}>{label}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
};

export default CheckoutSteps;
