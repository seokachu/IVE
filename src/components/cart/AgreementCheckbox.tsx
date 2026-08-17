import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import type { AgreementCheckboxProps } from "@/types/cart";

const AgreementCheckbox = ({ modalType, onChange, checked, labelText }: AgreementCheckboxProps) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <label className="flex cursor-pointer items-baseline gap-2 text-[13px] text-gray-500">
        <input type="checkbox" className="translate-y-[2px]" checked={checked} onChange={onChange} />
        {labelText}
      </label>
      <Button variant="plain" size="auto" onClick={modalType} aria-label="약관 전문 보기">
        <ChevronRight size={16} className="text-gray-400" />
      </Button>
    </div>
  );
};

export default AgreementCheckbox;
