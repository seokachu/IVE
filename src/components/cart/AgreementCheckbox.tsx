import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import type { AgreementCheckboxProps } from "@/types/cart";

const AgreementCheckbox = ({ modalType, onChange, checked, labelText }: AgreementCheckboxProps) => {
  return (
    <div className="flex items-center justify-between">
      <label className="flex items-baseline">
        <input type="checkbox" className="mr-2 translate-y-[1px]" checked={checked} onChange={onChange} />
        {labelText}
      </label>
      <Button variant="plain" size="auto" onClick={modalType}>
        <ChevronRight className="text-gray-500" />
      </Button>
    </div>
  );
};

export default AgreementCheckbox;
